from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any


class PromptService:
    def __init__(self):
        self.prompts_dir = Path(__file__).parent.parent / "prompts"

    def load_template(self, template_name: str) -> str:
        """Load markdown template file"""
        template_path = self.prompts_dir / f"{template_name}.md"

        if not template_path.exists():
            raise FileNotFoundError(f"Template {template_name} not found")

        with open(template_path, "r", encoding="utf-8") as f:
            return f.read()

    def format_comprehensive_prompt(
        self,
        from_location: str,
        to_location: str,
        stations_data: List[Dict],
        historical_routes: List[Dict],
        weather_data: Dict,
        **kwargs,
    ) -> str:
        """Create comprehensive prompt with ALL data sources"""
        template = self.load_template("comprehensive_route_optimization")

        # Format data for prompt
        stations_text = self._format_stations_data(stations_data)
        historical_text = self._format_historical_data(historical_routes)
        weather_text = self._format_weather_data(weather_data)

        variables = {
            "from_location": from_location,
            "to_location": to_location,
            "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "stations_data": stations_text,
            "historical_routes": historical_text,
            "weather_conditions": weather_text,
            **kwargs,
        }

        formatted_prompt = template
        for key, value in variables.items():
            formatted_prompt = formatted_prompt.replace(f"{{{key}}}", str(value))

        return formatted_prompt

    def _format_stations_data(self, stations: List[Dict]) -> str:
        """Format station data from your MySQL schema"""
        if not stations:
            return "No fuel stations data available."

        formatted = "Available Fuel Stations:\n"
        for station in stations:
            # FIXED to match your actual schema
            formatted += (
                f"- {station.get('name', 'Unknown')} ({station.get('code', 'N/A')})\n"
            )
            formatted += f"  Location: {station.get('city', 'Unknown')}, {station.get('region', 'Unknown')}\n"
            formatted += f"  Fuel Type: {station.get('fuel_type', 'Unknown').title()}, "
            formatted += f"Capacity: {station.get('capacity_liters', 0):,.0f} L, "
            formatted += f"Current: {station.get('current_level_liters', 0):,.0f} L\n"
            if station.get("lat") and station.get("lon"):
                formatted += f"  Coordinates: {station.get('lat', 0):.4f}, {station.get('lon', 0):.4f}\n"

        return formatted

    def _format_historical_data(self, routes: List[Dict]) -> str:
        """Format delivery data as historical route information"""
        if not routes:
            return "No recent delivery data available."

        formatted = "Recent Delivery History:\n"
        for delivery in routes[:5]:  # This is actually delivery data
            # FIXED to match your actual schema
            formatted += f"- Station: {delivery.get('station_name', 'Unknown')} ({delivery.get('station_code', 'N/A')})\n"
            formatted += f"  Location: {delivery.get('city', 'Unknown')}, {delivery.get('region', 'Unknown')}\n"
            formatted += f"  Volume: {delivery.get('volume_liters', 0):,.0f} L, "
            formatted += f"Status: {delivery.get('status', 'Unknown').title()}, "
            formatted += f"Truck: {delivery.get('truck_code', 'Unknown')} ({delivery.get('truck_plate', 'N/A')})\n"
            formatted += f"  Date: {delivery.get('delivery_date', 'Unknown')}\n"

        return formatted

    def _format_weather_data(self, weather: Dict[str, Any]) -> str:
        """Format weather data for prompt"""
        from_weather = weather.get("from_location", {})
        to_weather = weather.get("to_location", {})

        formatted = "Current Weather Conditions:\n"
        if from_weather:
            formatted += f"From Location: {from_weather.get('temp_c', 'Unknown')}°C, "
            formatted += f"{from_weather.get('condition', 'Unknown')}, "
            formatted += f"Wind: {from_weather.get('wind_kph', 'Unknown')} km/h\n"

        if to_weather:
            formatted += f"To Location: {to_weather.get('temp_c', 'Unknown')}°C, "
            formatted += f"{to_weather.get('condition', 'Unknown')}, "
            formatted += f"Wind: {to_weather.get('wind_kph', 'Unknown')} km/h\n"

        return formatted
