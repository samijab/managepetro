import mysql.connector
from mysql.connector import Error as MySQLError
from contextlib import contextmanager
from google import genai
from google.genai import types
from .prompt_service import PromptService
from .api_utils import get_weather
from config import config
from models.data_models import (
    StationData,
    DeliveryData,
    TruckData,
    DatabaseResult,
    WeatherResult,
    WeatherData,
    RouteOptimizationResponse,
)
from typing import Dict, Any, Optional, List


class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=config.GEMINI_API_KEY)
        self.prompt_service = PromptService()

        # Database configuration from centralized config
        self.db_config = {
            **config.get_db_config(),
            "autocommit": True,
            "get_warnings": True,
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

    def _extract_section(self, ai_response: str, section_name: str) -> str:
        """
        Helper method to extract a section from AI response
        Returns the content between section_name and next ### marker
        """
        if section_name not in ai_response:
            return ""

        section_content = ai_response.split(section_name)[1]
        if "###" in section_content:
            section_content = section_content.split("###")[0]

        return section_content.strip()

    def _clean_markdown(self, text: str) -> str:
        """
        Remove markdown formatting from text.
        Removes bold (**), italic (*), and other common markdown syntax.
        """
        if not text:
            return text

        import re

        cleaned = text
        # Remove bold markdown (**text**)
        cleaned = re.sub(r"\*\*(.+?)\*\*", r"\1", cleaned)
        # Remove italic markdown (*text* but not ** which is already handled)
        cleaned = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"\1", cleaned)
        # Remove underline markdown (__text__ and _text_)
        cleaned = re.sub(r"__(.+?)__", r"\1", cleaned)
        cleaned = re.sub(r"_(.+?)_", r"\1", cleaned)
        # Remove standalone ** or * that weren't part of pairs
        cleaned = re.sub(r"\*\*", "", cleaned)
        cleaned = re.sub(r"(?<!\w)\*(?!\w)", "", cleaned)

        return cleaned.strip()

    def _parse_key_value_lines(self, text: str, mappings: dict) -> dict:
        """
        Helper method to parse key-value pairs from text lines
        mappings: dict of {search_key: result_key}
        Example: {"Total Distance:": "total_distance"}
        """
        result = {}
        lines = text.split("\n")

        for line in lines:
            line = line.strip()
            for search_key, result_key in mappings.items():
                if search_key in line:
                    # Split only once after the search key to preserve time values (e.g., "6:00 AM")
                    parts = line.split(search_key, 1)
                    if len(parts) > 1:
                        value = parts[1].strip()
                        if value:  # Only add if not empty
                            # Clean markdown formatting from the value
                            result[result_key] = self._clean_markdown(value)
                    break  # Move to next line after finding a match

        return result

    async def optimize_route(
        self,
        from_location: str,
        to_location: str,
        llm_model: str = "gemini-2.5-flash",
        departure_time: Optional[str] = None,
        arrival_time: Optional[str] = None,
        time_mode: str = "departure",
        delivery_date: Optional[str] = None,
        vehicle_type: str = "fuel_delivery_truck",
        notes: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate route optimization using standardized data models"""

        # Get standardized data
        db_data = self._get_database_data(from_location, to_location)
        weather_data = self._get_weather_data(from_location, to_location)

        # Create prompt with standardized data
        comprehensive_prompt = self.prompt_service.format_comprehensive_prompt(
            from_location=from_location,
            to_location=to_location,
            stations_data=db_data.stations,
            historical_routes=db_data.deliveries,
            weather_data=weather_data,
            vehicle_type=vehicle_type,
            departure_time=departure_time,
            arrival_time=arrival_time,
            time_mode=time_mode,
            delivery_date=delivery_date,
            notes=notes,
        )

        ai_response = await self._call_gemini(comprehensive_prompt, llm_model)
        return self._parse_comprehensive_response(
            ai_response, db_data, weather_data, departure_time, arrival_time, time_mode
        )

    async def optimize_dispatch(
        self, truck_id: str, depot_location: str, llm_model: str = "gemini-2.5-flash"
    ) -> Dict[str, Any]:
        """Optimize dispatch route for a truck to deliver fuel to stations in need"""
        try:
            # Get truck details
            truck = self._get_truck_by_id(truck_id)
            if not truck:
                raise ValueError(f"Truck {truck_id} not found")

            # Get stations needing fuel
            stations_needing_fuel = self._get_stations_needing_refuel()

            # Get weather for depot location
            try:
                depot_weather = get_weather(depot_location)
            except:
                depot_weather = WeatherData(depot_location, 20, "Clear", 10, 50)

            # Create dispatch optimization prompt
            prompt = self._create_dispatch_prompt(
                truck=truck,
                stations=stations_needing_fuel,
                depot_location=depot_location,
                depot_weather=depot_weather,
            )

            # Get AI optimization
            ai_response = await self._call_gemini(prompt, llm_model)

            # Parse and return dispatch plan
            return self._parse_dispatch_response(
                ai_response=ai_response,
                truck=truck,
                stations=stations_needing_fuel,
                depot_location=depot_location,
            )

        except Exception as e:
            print(f"Dispatch optimization failed: {e}")
            raise

    def _get_database_data(
        self, from_location: str, to_location: str
    ) -> DatabaseResult:
        """Query database and return standardized data models"""
        try:
            with self.get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True, buffered=True)

                try:
                    # Get stations
                    stations_query = """
                        SELECT id, code, name, lat, lon, city, region, 
                               fuel_type, capacity_liters, current_level_liters
                        FROM stations 
                        WHERE current_level_liters > %s
                        ORDER BY capacity_liters DESC
                        LIMIT %s
                    """
                    cursor.execute(stations_query, (1000, 10))
                    stations_raw = cursor.fetchall()
                    stations = [StationData(**row) for row in stations_raw]

                    # Get deliveries
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
                    deliveries_raw = cursor.fetchall()
                    deliveries = [DeliveryData(**row) for row in deliveries_raw]

                    # Get trucks
                    trucks_query = """
                        SELECT id, code, plate, capacity_liters,
                               fuel_level_percent, fuel_type, status
                        FROM trucks
                        WHERE status = %s
                        ORDER BY capacity_liters DESC
                        LIMIT %s
                    """
                    cursor.execute(trucks_query, ("active", 5))
                    trucks_raw = cursor.fetchall()
                    trucks = [TruckData(**row) for row in trucks_raw]

                    conn.commit()
                    return DatabaseResult(stations, deliveries, trucks)

                except MySQLError as e:
                    conn.rollback()
                    print(f"Query execution failed: {e.errno} - {e.msg}")
                    raise
                finally:
                    cursor.close()

        except MySQLError as e:
            print(f"Database query failed: {e.errno} - {e.msg}")
            return DatabaseResult([], [], [])
        except Exception as e:
            print(f"Unexpected database error: {e}")
            return DatabaseResult([], [], [])

    def _get_weather_data(self, from_location: str, to_location: str) -> WeatherResult:
        """Get weather data using standardized models"""
        try:
            from_weather = get_weather(from_location)
            to_weather = get_weather(to_location)
            return WeatherResult(from_weather, to_weather)
        except Exception as e:
            print(f"Weather data failed: {e}")
            # Return empty weather data
            empty_weather = WeatherData("Unknown", 0, "Unknown", 0, 0)
            return WeatherResult(empty_weather, empty_weather)

    def get_all_stations(self):
        """Get all stations from database for API endpoints"""
        try:
            with self.get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True, buffered=True)
                try:
                    stations_query = """
                        SELECT id, code, name, lat, lon, city, region, 
                               fuel_type, capacity_liters, current_level_liters,
                               request_method, low_fuel_threshold
                        FROM stations 
                        ORDER BY name
                    """
                    cursor.execute(stations_query)
                    stations_raw = cursor.fetchall()
                    stations = [StationData(**row) for row in stations_raw]
                    conn.commit()
                    return stations
                except MySQLError as e:
                    conn.rollback()
                    print(f"Query execution failed: {e.errno} - {e.msg}")
                    raise
                finally:
                    cursor.close()
        except Exception as e:
            print(f"Failed to get stations: {e}")
            return []

    def get_all_trucks(self):
        """Get all trucks from database for API endpoints"""
        try:
            with self.get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True, buffered=True)
                try:
                    trucks_query = """
                        SELECT id, code, plate, capacity_liters,
                               fuel_level_percent, fuel_type, status
                        FROM trucks
                        ORDER BY code
                    """
                    cursor.execute(trucks_query)
                    trucks_raw = cursor.fetchall()

                    trucks = []
                    for truck_row in trucks_raw:
                        # Get compartments for this truck
                        compartments_query = """
                            SELECT compartment_number, fuel_type, capacity_liters, current_level_liters
                            FROM truck_compartments
                            WHERE truck_id = %s
                            ORDER BY compartment_number
                        """
                        cursor.execute(compartments_query, (truck_row["id"],))
                        compartments = cursor.fetchall()

                        truck = TruckData(**truck_row, compartments=compartments)
                        trucks.append(truck)

                    conn.commit()
                    return trucks
                except MySQLError as e:
                    conn.rollback()
                    print(f"Query execution failed: {e.errno} - {e.msg}")
                    raise
                finally:
                    cursor.close()
        except Exception as e:
            print(f"Failed to get trucks: {e}")
            return []

    async def _call_gemini(self, prompt: str, model: str) -> str:
        """Make the actual Gemini API call with proper error handling"""
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
            error_msg = str(e)
            if (
                "quota" in error_msg.lower()
                or "resource_exhausted" in error_msg.lower()
            ):
                print(f"Gemini API quota exceeded: {e}")
                raise Exception(
                    "Gemini API quota exceeded. Please check your API limits or wait before retrying."
                )
            elif "not_found" in error_msg.lower():
                print(f"Gemini model not found: {e}")
                raise Exception(
                    f"Model '{model}' not found. Please check if the model name is correct."
                )
            else:
                print(f"Gemini API call failed: {e}")
                raise e

    def _parse_comprehensive_response(
        self,
        ai_response: str,
        db_data: DatabaseResult,
        weather_data: WeatherResult,
        departure_time: Optional[str] = None,
        arrival_time: Optional[str] = None,
        time_mode: str = "departure",
    ) -> Dict[str, Any]:
        """Parse AI response using standardized data models"""

        # Extract parsed data
        try:
            parsed_directions = self._extract_directions_from_ai(ai_response)
            route_summary = self._extract_route_summary_from_ai(
                ai_response, weather_data.from_location, weather_data.to_location
            )
            traffic_info = self._extract_traffic_info_from_ai(ai_response)
        except Exception as e:
            print(f"Failed to parse AI response: {e}")
            parsed_directions = [{"step": 1, "instruction": "See AI analysis below"}]
            route_summary = {
                "from": weather_data.from_location.city,
                "to": weather_data.to_location.city,
                "ai_generated": True,
            }
            traffic_info = {"note": "Traffic analysis in AI response"}

        # Add time-based information to traffic_info
        if time_mode == "departure" and departure_time:
            traffic_info["requested_departure"] = departure_time
        elif time_mode == "arrival" and arrival_time:
            traffic_info["requested_arrival"] = arrival_time

        # Build route summary with defaults
        complete_route_summary = {
            # Core route information
            "from": route_summary.get("from", "Unknown"),
            "to": route_summary.get("to", "Unknown"),
            "total_distance": route_summary.get("total_distance", "AI Generated"),
            "estimated_duration": route_summary.get(
                "estimated_duration", "AI Generated"
            ),
            "duration_with_traffic": route_summary.get(
                "duration_with_traffic", "See AI analysis"
            ),
            # Route details
            "primary_route": route_summary.get("primary_route", "AI Optimized Route"),
            "route_type": route_summary.get("route_type", "AI Optimized"),
            # Timing and conditions
            "best_departure_time": route_summary.get(
                "best_departure_time", "See AI recommendations"
            ),
            "recommended_arrival_time": route_summary.get(
                "recommended_arrival_time", "See AI recommendations"
            ),
            "weather_impact": route_summary.get(
                "weather_impact", f"Current: {weather_data.from_location.condition}"
            ),
            # Fuel planning
            "fuel_stops": route_summary.get("fuel_stops", "See fuel stations section"),
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
        }

        # Use the centralized response model
        response = RouteOptimizationResponse.from_parsed_data(
            route_summary=complete_route_summary,
            parsed_directions=parsed_directions,
            traffic_info=traffic_info,
            db_data=db_data,
            weather_data=weather_data,
            ai_response=ai_response,
        )

        return response.to_api_dict()

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
        self,
        ai_response: str,
        from_weather: WeatherData,
        to_weather: WeatherData,
    ) -> dict:
        """Extract comprehensive route summary from AI response"""
        summary = {
            "from": from_weather.city,
            "to": to_weather.city,
            "ai_generated": True,
        }

        try:
            # Look for ROUTE SUMMARY section
            summary_section = self._extract_section(ai_response, "ROUTE SUMMARY")

            if summary_section:
                # Define mappings for key-value extraction
                mappings = {
                    "Total Distance:": "total_distance",
                    "Estimated Duration:": "estimated_duration",
                    "Duration with Traffic:": "duration_with_traffic",
                    "Primary Route:": "primary_route",
                    "Route Type:": "route_type",
                    "Weather Impact:": "weather_impact",
                    "Fuel Stops Required:": "fuel_stops",
                    "Estimated Fuel Cost:": "estimated_fuel_cost",
                    "Best Departure Time:": "best_departure_time",
                    "Recommended Arrival Time:": "recommended_arrival_time",
                }

                parsed = self._parse_key_value_lines(summary_section, mappings)
                summary.update(parsed)

        except Exception as e:
            print(f"Error parsing route summary: {e}")

        return summary

    def _extract_traffic_info_from_ai(self, ai_response: str) -> dict:
        """Extract traffic conditions from AI response"""
        traffic_info = {"ai_analysis": True}

        try:
            # Look for TRAFFIC CONDITIONS section
            traffic_section = self._extract_section(ai_response, "TRAFFIC CONDITIONS")

            if traffic_section:
                mappings = {
                    "Current Traffic:": "current_traffic",
                    "Typical Travel Time:": "typical_time",
                    "Best Departure Time:": "best_departure",
                    "Expected Delays:": "delays",
                }

                parsed = self._parse_key_value_lines(traffic_section, mappings)
                traffic_info.update(parsed)

        except Exception as e:
            print(f"Error parsing traffic info: {e}")

        return traffic_info

    def _get_truck_by_id(self, truck_id: str) -> Optional[TruckData]:
        """Get a specific truck by ID"""
        try:
            # Extract numeric ID from truck_id (e.g., "truck-001" -> 1)
            if truck_id.startswith("truck-"):
                numeric_id = int(truck_id.split("-")[1])
            else:
                numeric_id = int(truck_id)

            with self.get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True, buffered=True)
                try:
                    truck_query = """
                        SELECT id, code, plate, capacity_liters,
                               fuel_level_percent, fuel_type, status
                        FROM trucks
                        WHERE id = %s
                    """
                    cursor.execute(truck_query, (numeric_id,))
                    truck_row = cursor.fetchone()

                    if not truck_row:
                        return None

                    # Get compartments
                    compartments_query = """
                        SELECT compartment_number, fuel_type, capacity_liters, current_level_liters
                        FROM truck_compartments
                        WHERE truck_id = %s
                        ORDER BY compartment_number
                    """
                    cursor.execute(compartments_query, (truck_row["id"],))
                    compartments = cursor.fetchall()

                    truck = TruckData(**truck_row, compartments=compartments)
                    conn.commit()
                    return truck
                except MySQLError as e:
                    conn.rollback()
                    print(f"Query execution failed: {e.errno} - {e.msg}")
                    return None
                finally:
                    cursor.close()
        except Exception as e:
            print(f"Failed to get truck: {e}")
            return None

    def _get_stations_needing_refuel(self) -> List[StationData]:
        """Get all stations that need refuelling"""
        try:
            with self.get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True, buffered=True)
                try:
                    stations_query = """
                        SELECT id, code, name, lat, lon, city, region, 
                               fuel_type, capacity_liters, current_level_liters,
                               request_method, low_fuel_threshold
                        FROM stations 
                        WHERE current_level_liters < COALESCE(low_fuel_threshold, 5000)
                        ORDER BY (current_level_liters / capacity_liters) ASC
                        LIMIT 20
                    """
                    cursor.execute(stations_query)
                    stations_raw = cursor.fetchall()
                    stations = [StationData(**row) for row in stations_raw]
                    conn.commit()
                    return stations
                except MySQLError as e:
                    conn.rollback()
                    print(f"Query execution failed: {e.errno} - {e.msg}")
                    return []
                finally:
                    cursor.close()
        except Exception as e:
            print(f"Failed to get stations: {e}")
            return []

    def _create_dispatch_prompt(
        self,
        truck: TruckData,
        stations: List[StationData],
        depot_location: str,
        depot_weather: WeatherData,
    ) -> str:
        """Create a prompt for dispatch optimization using prompt service"""
        return self.prompt_service.format_dispatch_prompt(
            truck=truck,
            stations=stations,
            depot_location=depot_location,
            depot_weather=depot_weather,
        )

    def _parse_dispatch_response(
        self,
        ai_response: str,
        truck: TruckData,
        stations: List[StationData],
        depot_location: str,
    ) -> Dict[str, Any]:
        """Parse the AI response for dispatch optimization"""

        # Extract dispatch summary using helper
        dispatch_summary = {}
        try:
            summary_section = self._extract_section(ai_response, "DISPATCH SUMMARY")

            if summary_section:
                mappings = {
                    "Total Stations to Visit:": "total_stations",
                    "Total Distance:": "total_distance",
                    "Estimated Duration:": "estimated_duration",
                    "Total Fuel to Deliver:": "total_fuel",
                    "Departure Time:": "departure_time",
                    "Return to Depot:": "return_time",
                }

                dispatch_summary = self._parse_key_value_lines(
                    summary_section, mappings
                )
        except Exception as e:
            print(f"Error parsing dispatch summary: {e}")

        # Extract route stops
        route_stops = []
        try:
            route_section = self._extract_section(ai_response, "OPTIMIZED ROUTE")

            if route_section:
                # Parse numbered route items
                lines = route_section.split("\n")
                current_stop = {}

                for line in lines:
                    line = line.strip()
                    if line and line[0].isdigit() and "." in line:
                        # Save previous stop if exists
                        if current_stop:
                            route_stops.append(current_stop)
                        # Start new stop - extract step number for sorting
                        parts = line.split(".", 1)
                        try:
                            step_number = int(parts[0].strip())
                            station_info = self._clean_markdown(parts[1].strip())
                            current_stop = {
                                "step_number": step_number,
                                "station": station_info,
                            }
                        except (ValueError, IndexError):
                            # Fallback if step number parsing fails
                            station_info = self._clean_markdown(
                                line.split(".", 1)[1].strip()
                            )
                            current_stop = {"station": station_info}
                    elif "Distance from previous:" in line:
                        current_stop["distance"] = self._clean_markdown(
                            line.split(":", 1)[-1].strip()
                        )
                    elif "Fuel to deliver:" in line:
                        current_stop["fuel_delivery"] = self._clean_markdown(
                            line.split(":", 1)[-1].strip()
                        )
                    elif "ETA:" in line:
                        current_stop["eta"] = self._clean_markdown(
                            line.split(":", 1)[-1].strip()
                        )
                    elif "Reason:" in line:
                        current_stop["reason"] = self._clean_markdown(
                            line.split(":", 1)[-1].strip()
                        )

                # Add last stop
                if current_stop:
                    route_stops.append(current_stop)

                # Sort stops by step_number to ensure correct order
                route_stops.sort(key=lambda x: x.get("step_number", float("inf")))

                # Remove step_number from the output as it's only used for sorting
                for stop in route_stops:
                    stop.pop("step_number", None)
        except Exception as e:
            print(f"Error parsing route stops: {e}")

        return {
            "dispatch_summary": dispatch_summary,
            "truck": {
                "truck_id": f"truck-{truck.id:03d}",
                "code": truck.code,
                "plate": truck.plate,
                "status": truck.status,
                "compartments": truck.compartments or [],
            },
            "depot_location": depot_location,
            "route_stops": route_stops,
            "stations_available": [
                {
                    "station_id": f"station-{s.id:03d}",
                    "name": s.name,
                    "city": s.city,
                    "region": s.region,
                    "fuel_type": s.fuel_type,
                    "current_level": s.current_level_liters,
                    "capacity": s.capacity_liters,
                    "fuel_level_percent": int(
                        (s.current_level_liters / s.capacity_liters) * 100
                    ),
                    "request_method": s.request_method,
                    "needs_refuel": s.needs_refuel,
                    "lat": float(s.lat),
                    "lon": float(s.lon),
                }
                for s in stations
            ],
            "ai_analysis": ai_response,
        }
