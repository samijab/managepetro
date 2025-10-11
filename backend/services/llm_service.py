from dotenv import load_dotenv
import os
import mysql.connector
from mysql.connector import Error as MySQLError
from contextlib import contextmanager
from google import genai
from google.genai import types
from .prompt_service import PromptService
from .api_utils import get_weather
from typing import Dict, Any

# Load environment variables
load_dotenv()


class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("gemenikey"))
        self.prompt_service = PromptService()

        # SIMPLIFIED connection config (better for development)
        self.db_config = {
            "host": "localhost",
            "port": 3306,
            "user": "mp_app",
            "password": "devpass",
            "database": "manage_petro",
            "charset": "utf8mb4",
            "use_unicode": True,
            "autocommit": False,
            "connection_timeout": 10,
            # REMOVED problematic pool settings for development
        }

    @contextmanager
    def get_db_connection(self):
        """Context manager for MySQL database connections"""
        conn = None
        try:
            # Simple connection without pooling for development
            conn = mysql.connector.connect(**self.db_config)
            yield conn
        except MySQLError as e:
            if conn and conn.is_connected():
                conn.rollback()
            print(f"MySQL Error: {e.errno} - {e.msg}")
            raise
        except Exception as e:
            if conn and conn.is_connected():
                conn.rollback()
            print(f"Database connection error: {e}")
            raise
        finally:
            if conn and conn.is_connected():
                conn.close()

    async def optimize_route(
        self, from_location: str, to_location: str, llm_model: str = "gemini-2.5-flash"
    ) -> Dict[str, Any]:
        """Generate route optimization combining ALL data sources"""

        # Step 1: Get database data
        db_data = self._get_database_data(from_location, to_location)

        # Step 2: Get weather data
        weather_data = self._get_weather_data(from_location, to_location)

        # Step 3: Create comprehensive prompt
        comprehensive_prompt = self.prompt_service.format_comprehensive_prompt(
            from_location=from_location,
            to_location=to_location,
            stations_data=db_data["stations"],
            historical_routes=db_data["deliveries"],
            weather_data=weather_data,
            vehicle_type="fuel_delivery_truck",
        )

        # Step 4: Send to AI
        ai_response = await self._call_gemini(comprehensive_prompt, llm_model)

        # Step 5: Parse and return
        return self._parse_comprehensive_response(ai_response, db_data, weather_data)

    def _get_database_data(
        self, from_location: str, to_location: str
    ) -> Dict[str, Any]:
        """Query MySQL database matching your actual schema (docs best practices)"""
        try:
            with self.get_db_connection() as conn:
                # Use buffered cursor with dictionary results (recommended)
                cursor = conn.cursor(dictionary=True, buffered=True)

                try:
                    # Get stations from your actual schema (FIXED - removed last_delivery and created_at)
                    stations_query = """
                        SELECT id, code, name, lat, lon, city, region, 
                               fuel_type, capacity_liters, current_level_liters
                        FROM stations 
                        WHERE current_level_liters > %s
                        ORDER BY capacity_liters DESC
                        LIMIT %s
                    """
                    cursor.execute(stations_query, (1000, 10))
                    stations = cursor.fetchall()

                    # Get delivery data as "historical routes" (FIXED - removed model reference)
                    deliveries_query = """
                        SELECT d.id, d.volume_liters, d.delivery_date, d.status,
                               s.name as station_name, s.code as station_code,
                               s.city, s.region, s.lat, s.lon,
                               t.code as truck_code, t.plate as truck_plate
                        FROM deliveries d
                        JOIN stations s ON d.station_id = s.id
                        JOIN trucks t ON d.truck_id = t.id
                        WHERE d.delivery_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                        AND (s.city LIKE %s OR s.region LIKE %s 
                             OR s.city LIKE %s OR s.region LIKE %s)
                        ORDER BY d.delivery_date DESC
                        LIMIT %s
                    """
                    location_params = (
                        f"%{from_location}%",
                        f"%{from_location}%",
                        f"%{to_location}%",
                        f"%{to_location}%",
                        15,
                    )
                    cursor.execute(deliveries_query, location_params)
                    deliveries = cursor.fetchall()

                    # Get truck information for context (FIXED - removed model and last_maintenance)
                    trucks_query = """
                        SELECT id, code, plate, capacity_liters,
                               fuel_level_percent, fuel_type, status
                        FROM trucks
                        WHERE status = %s
                        ORDER BY capacity_liters DESC
                        LIMIT %s
                    """
                    cursor.execute(trucks_query, ("active", 5))
                    trucks = cursor.fetchall()

                    # Commit the transaction (even for SELECT queries, good practice)
                    conn.commit()

                    return {
                        "stations": stations,
                        "deliveries": deliveries,
                        "trucks": trucks,
                    }

                except MySQLError as e:
                    conn.rollback()
                    print(f"Query execution failed: {e.errno} - {e.msg}")
                    raise
                finally:
                    cursor.close()

        except MySQLError as e:
            print(f"Database query failed: {e.errno} - {e.msg}")
            return {"stations": [], "deliveries": [], "trucks": []}
        except Exception as e:
            print(f"Unexpected database error: {e}")
            return {"stations": [], "deliveries": [], "trucks": []}

    def _get_weather_data(self, from_location: str, to_location: str) -> Dict[str, Any]:
        """Get weather data for both locations"""
        try:
            from_weather = get_weather(from_location)
            to_weather = get_weather(to_location)

            return {
                "from_location": {"location": from_location, **from_weather},
                "to_location": {"location": to_location, **to_weather},
            }
        except Exception as e:
            print(f"Weather data failed: {e}")
            return {"from_location": {}, "to_location": {}}

    async def _call_gemini(self, prompt: str, model: str) -> str:
        """Make the actual Gemini API call"""
        try:
            response = await self.client.aio.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=3000,
                ),
            )

            return response.text

        except Exception as e:
            print(f"Gemini API call failed: {e}")
            raise e

    def _parse_comprehensive_response(
        self, ai_response: str, db_data: Dict, weather_data: Dict
    ) -> Dict[str, Any]:
        """Parse AI response - Google Maps style with REAL AI-generated directions"""

        # Extract weather info
        from_weather = weather_data.get("from_location", {})
        to_weather = weather_data.get("to_location", {})

        # Try to parse structured data from AI response
        try:
            parsed_directions = self._extract_directions_from_ai(ai_response)
            route_summary = self._extract_route_summary_from_ai(
                ai_response, from_weather, to_weather
            )
            traffic_info = self._extract_traffic_info_from_ai(ai_response)

        except Exception as e:
            print(f"Failed to parse AI response: {e}")
            # Enhanced fallback with more realistic data
            parsed_directions = [
                {"step": 1, "instruction": "See AI analysis below for detailed route"}
            ]
            route_summary = {
                "from": from_weather.get("location", "Unknown"),
                "to": to_weather.get("location", "Unknown"),
                "note": "Route details generated by AI - see ai_analysis section",
                "ai_generated": True,
            }
            traffic_info = {"note": "Traffic analysis in AI response"}

        return {
            "route_summary": {
                # Core route information
                "from": route_summary.get("from", "Unknown"),
                "to": route_summary.get("to", "Unknown"),
                "total_distance": route_summary.get(
                    "total_distance", route_summary.get("distance", "AI Generated")
                ),
                "estimated_duration": route_summary.get(
                    "estimated_duration", route_summary.get("duration", "AI Generated")
                ),
                "duration_with_traffic": route_summary.get(
                    "duration_with_traffic", "See AI analysis"
                ),
                # Route details
                "primary_route": route_summary.get(
                    "primary_route", route_summary.get("route", "AI Optimized Route")
                ),
                "route_type": route_summary.get("route_type", "AI Optimized"),
                # Timing and conditions
                "best_departure_time": route_summary.get(
                    "best_departure_time", "See AI recommendations"
                ),
                "weather_impact": route_summary.get(
                    "weather_impact",
                    f"Current: {from_weather.get('condition', 'Unknown')}",
                ),
                # Fuel planning
                "fuel_stops": route_summary.get(
                    "fuel_stops", "See fuel stations section"
                ),
                "estimated_fuel_cost": route_summary.get(
                    "estimated_fuel_cost", "Calculated by AI"
                ),
                # Meta information
                "ai_generated": True,
                "optimization_factors": [
                    "Real-time weather",
                    "Fuel station inventory",
                    "Historical delivery data",
                ],
            },
            "directions": parsed_directions,
            "traffic_conditions": traffic_info,
            "weather_impact": {
                "from_location": {
                    "city": from_weather.get("location", "Start"),
                    "temperature": f"{from_weather.get('temp_c', 'N/A')}°C",
                    "condition": from_weather.get("condition", "Unknown"),
                    "wind": f"{from_weather.get('wind_kph', 'N/A')} km/h",
                    "visibility": "Good",
                },
                "to_location": {
                    "city": to_weather.get("location", "Destination"),
                    "temperature": f"{to_weather.get('temp_c', 'N/A')}°C",
                    "condition": to_weather.get("condition", "Unknown"),
                    "wind": f"{to_weather.get('wind_kph', 'N/A')} km/h",
                    "visibility": "Good",
                },
                "route_impact": f"Weather conditions: {from_weather.get('condition', 'Unknown')}",
                "driving_conditions": (
                    "Normal" if from_weather.get("condition") != "Rain" else "Cautious"
                ),
            },
            "fuel_stations": [
                {
                    "name": station.get("name", "Unknown Station"),
                    "code": station.get("code", "N/A"),
                    "location": f"{station.get('city', 'Unknown')}, {station.get('region', 'Unknown')}",
                    "fuel_type": station.get("fuel_type", "diesel").title(),
                    "capacity": f"{station.get('capacity_liters', 0):,.0f} L",
                    "current_level": f"{station.get('current_level_liters', 0):,.0f} L",
                    "availability": (
                        "Available"
                        if station.get("current_level_liters", 0) > 5000
                        else "Low Stock"
                    ),
                    "coordinates": {
                        "lat": (
                            float(station.get("lat", 0)) if station.get("lat") else None
                        ),
                        "lon": (
                            float(station.get("lon", 0)) if station.get("lon") else None
                        ),
                    },
                }
                for station in db_data["stations"][:5]
            ],
            "recent_deliveries": [
                {
                    "delivery_id": delivery.get("id", "Unknown"),
                    "station": f"{delivery.get('station_name', 'Unknown')} ({delivery.get('station_code', 'N/A')})",
                    "location": f"{delivery.get('city', 'Unknown')}, {delivery.get('region', 'Unknown')}",
                    "volume": f"{delivery.get('volume_liters', 0):,.0f} L",
                    "date": str(delivery.get("delivery_date", "Unknown")),
                    "status": delivery.get("status", "unknown").title(),
                    "truck": f"{delivery.get('truck_code', 'Unknown')} ({delivery.get('truck_plate', 'N/A')})",
                    "coordinates": {
                        "lat": (
                            float(delivery.get("lat", 0))
                            if delivery.get("lat")
                            else None
                        ),
                        "lon": (
                            float(delivery.get("lon", 0))
                            if delivery.get("lon")
                            else None
                        ),
                    },
                }
                for delivery in db_data["deliveries"][:5]
            ],
            "available_trucks": [
                {
                    "code": truck.get("code", "Unknown"),
                    "plate": truck.get("plate", "N/A"),
                    "fuel_capacity": f"{truck.get('capacity_liters', 0):,.0f} L",
                    "fuel_level": f"{truck.get('fuel_level_percent', 0)}%",
                    "fuel_type": truck.get("fuel_type", "diesel").title(),
                    "status": truck.get("status", "unknown").title(),
                }
                for truck in db_data["trucks"][:3]
            ],
            "data_sources": {
                "database_stations": len(db_data["stations"]),
                "recent_deliveries": len(db_data["deliveries"]),
                "available_trucks": len(db_data["trucks"]),
                "weather_data": "included" if weather_data else "unavailable",
                "ai_analysis": "included",
            },
            "ai_analysis": ai_response,
        }

    def _extract_directions_from_ai(self, ai_response: str) -> list:
        """Extract turn-by-turn directions from AI response"""
        directions = []

        try:
            # Look for the TURN-BY-TURN DIRECTIONS section
            if "TURN-BY-TURN DIRECTIONS" in ai_response:
                directions_section = ai_response.split("TURN-BY-TURN DIRECTIONS")[1]
                if "###" in directions_section:
                    directions_section = directions_section.split("###")[0]

                lines = directions_section.strip().split("\n")
                step_num = 1
                i = 0

                while i < len(lines):
                    line = lines[i].strip()

                    # Look for numbered instruction line
                    if line and (
                        line.startswith(f"{step_num}.")
                        or line.startswith(str(step_num))
                    ):
                        # Extract instruction
                        if ". " in line:
                            instruction = line.split(". ", 1)[1]
                        else:
                            instruction = line

                        distance = "N/A"
                        duration = "N/A"

                        # Look at the next line for distance/duration
                        if i + 1 < len(lines):
                            next_line = lines[i + 1].strip()

                            # Method 1: Parse "Distance: X.X km | Duration: X min" format
                            if "Distance:" in next_line and "|" in next_line:
                                parts = next_line.split("|")
                                if len(parts) >= 2:
                                    distance_part = (
                                        parts[0].replace("Distance:", "").strip()
                                    )
                                    duration_part = (
                                        parts[1].replace("Duration:", "").strip()
                                    )
                                    distance = distance_part
                                    duration = duration_part

                            # Method 2: Parse inline format like "(15.2 km, 18 min)"
                            elif (
                                "(" in instruction
                                and "km" in instruction
                                and "min" in instruction
                            ):
                                import re

                                # Extract distance and duration from parentheses
                                match = re.search(r"\(([^)]+)\)", instruction)
                                if match:
                                    content = match.group(1)
                                    parts = content.split(",")
                                    if len(parts) >= 2:
                                        distance = parts[0].strip()
                                        duration = parts[1].strip()
                                    # Remove the parentheses from instruction
                                    instruction = re.sub(
                                        r"\([^)]+\)", "", instruction
                                    ).strip()

                        # Determine maneuver type
                        maneuver = "straight"
                        instruction_lower = instruction.lower()
                        if "turn left" in instruction_lower:
                            maneuver = "turn-left"
                        elif "turn right" in instruction_lower:
                            maneuver = "turn-right"
                        elif "merge" in instruction_lower:
                            maneuver = "merge"
                        elif "exit" in instruction_lower:
                            maneuver = "exit-right"
                        elif "arrive" in instruction_lower:
                            maneuver = "arrive"

                        directions.append(
                            {
                                "step": step_num,
                                "instruction": instruction,
                                "distance": distance,
                                "duration": duration,
                                "maneuver": maneuver,
                            }
                        )

                        step_num += 1

                    i += 1

            # Fallback if no structured directions found
            if not directions:
                # Try to extract any numbered lines as basic directions
                lines = ai_response.split("\n")
                step_num = 1

                for line in lines:
                    line = line.strip()
                    if line.startswith(f"{step_num}."):
                        instruction = line.split(".", 1)[1].strip()
                        directions.append(
                            {
                                "step": step_num,
                                "instruction": instruction,
                                "distance": "Generated by AI",
                                "duration": "See AI analysis",
                                "maneuver": "straight",
                            }
                        )
                        step_num += 1
                        if step_num > 10:  # Limit to reasonable number
                            break

            # Final fallback
            if not directions:
                directions = [
                    {
                        "step": 1,
                        "instruction": "Follow AI-generated route (see full analysis below)",
                        "distance": "See AI analysis",
                        "duration": "See AI analysis",
                        "maneuver": "straight",
                    }
                ]

        except Exception as e:
            print(f"Error parsing directions: {e}")
            directions = [
                {
                    "step": 1,
                    "instruction": "AI route analysis available below",
                    "distance": "See full analysis",
                    "duration": "See full analysis",
                    "maneuver": "straight",
                }
            ]

        return directions

    def _extract_route_summary_from_ai(
        self, ai_response: str, from_weather: dict, to_weather: dict
    ) -> dict:
        """Extract comprehensive route summary from AI response"""
        summary = {
            "from": from_weather.get("location", "Unknown"),
            "to": to_weather.get("location", "Unknown"),
            "ai_generated": True,
        }

        try:
            # Look for ROUTE SUMMARY section
            if "ROUTE SUMMARY" in ai_response:
                summary_section = ai_response.split("ROUTE SUMMARY")[1]
                if "###" in summary_section:
                    summary_section = summary_section.split("###")[0]

                lines = summary_section.strip().split("\n")
                for line in lines:
                    line = line.strip()

                    # Parse all the different summary fields
                    if "Total Distance:" in line:
                        summary["total_distance"] = line.split("Total Distance:")[
                            1
                        ].strip()
                    elif "Distance:" in line and "Total Distance:" not in line:
                        summary["distance"] = line.split("Distance:")[1].strip()

                    elif "Estimated Duration:" in line:
                        summary["estimated_duration"] = line.split(
                            "Estimated Duration:"
                        )[1].strip()
                    elif "Duration:" in line and "Estimated Duration:" not in line:
                        summary["duration"] = line.split("Duration:")[1].strip()

                    elif "Duration with Traffic:" in line:
                        summary["duration_with_traffic"] = line.split(
                            "Duration with Traffic:"
                        )[1].strip()

                    elif "Primary Route:" in line:
                        summary["primary_route"] = line.split("Primary Route:")[
                            1
                        ].strip()
                    elif "Route:" in line and "Primary Route:" not in line:
                        summary["route"] = line.split("Route:")[1].strip()

                    elif "Route Type:" in line:
                        summary["route_type"] = line.split("Route Type:")[1].strip()

                    elif "Weather Impact:" in line:
                        summary["weather_impact"] = line.split("Weather Impact:")[
                            1
                        ].strip()

                    elif "Fuel Stops Required:" in line:
                        summary["fuel_stops"] = line.split("Fuel Stops Required:")[
                            1
                        ].strip()

                    elif "Estimated Fuel Cost:" in line:
                        summary["estimated_fuel_cost"] = line.split(
                            "Estimated Fuel Cost:"
                        )[1].strip()

                    elif "Best Departure Time:" in line:
                        summary["best_departure_time"] = line.split(
                            "Best Departure Time:"
                        )[1].strip()

            # Add calculated fields if basic distance/duration found
            if "distance" in summary or "total_distance" in summary:
                distance_str = summary.get(
                    "total_distance", summary.get("distance", "Unknown")
                )
                summary["distance_display"] = distance_str

            if "duration" in summary or "estimated_duration" in summary:
                duration_str = summary.get(
                    "estimated_duration", summary.get("duration", "Unknown")
                )
                summary["duration_display"] = duration_str

        except Exception as e:
            print(f"Error parsing route summary: {e}")

        return summary

    def _extract_traffic_info_from_ai(self, ai_response: str) -> dict:
        """Extract traffic conditions from AI response"""
        traffic_info = {"ai_analysis": True}

        try:
            # Look for TRAFFIC CONDITIONS section
            if "TRAFFIC CONDITIONS" in ai_response:
                traffic_section = ai_response.split("TRAFFIC CONDITIONS")[1]
                if "###" in traffic_section:
                    traffic_section = traffic_section.split("###")[0]

                lines = traffic_section.strip().split("\n")
                for line in lines:
                    line = line.strip()
                    if "Current Traffic:" in line:
                        traffic_info["current_traffic"] = line.split(
                            "Current Traffic:"
                        )[1].strip()
                    elif "Typical Travel Time:" in line:
                        traffic_info["typical_time"] = line.split(
                            "Typical Travel Time:"
                        )[1].strip()
                    elif "Best Departure Time:" in line:
                        traffic_info["best_departure"] = line.split(
                            "Best Departure Time:"
                        )[1].strip()
                    elif "Expected Delays:" in line:
                        traffic_info["delays"] = line.split("Expected Delays:")[
                            1
                        ].strip()

        except Exception as e:
            print(f"Error parsing traffic info: {e}")

        return traffic_info
