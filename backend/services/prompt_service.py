from pathlib import Path
from datetime import datetime
from typing import List
from models.data_models import (
    StationData,
    DeliveryData,
    WeatherResult,
)


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
        stations_data: List[StationData],
        historical_routes: List[DeliveryData],
        weather_data: WeatherResult,
        **kwargs,
    ) -> str:
        """Create comprehensive prompt using standardized data models"""
        template = self.load_template("comprehensive_route_optimization")

        # Format data using standardized models
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

    def _format_stations_data(self, stations: List[StationData]) -> str:
        """Format station data using standardized models"""
        if not stations:
            return "No fuel stations data available."

        formatted = "Available Fuel Stations:\n"
        for station in stations:
            formatted += f"- {station.name} ({station.code})\n"
            formatted += f"  Location: {station.city}, {station.region}\n"
            formatted += f"  Fuel Type: {station.fuel_type.title()}, "
            formatted += f"Capacity: {station.capacity_liters:,.0f} L, "
            formatted += f"Current: {station.current_level_liters:,.0f} L\n"
            formatted += f"  Coordinates: {station.lat:.4f}, {station.lon:.4f}\n"

        return formatted

    def _format_historical_data(self, deliveries: List[DeliveryData]) -> str:
        """Format delivery data using standardized models"""
        if not deliveries:
            return "No recent delivery data available."

        formatted = "Recent Delivery History:\n"
        for delivery in deliveries[:5]:
            formatted += (
                f"- Station: {delivery.station_name} ({delivery.station_code})\n"
            )
            formatted += f"  Location: {delivery.city}, {delivery.region}\n"
            formatted += f"  Volume: {delivery.volume_liters:,.0f} L, "
            formatted += f"Status: {delivery.status.title()}, "
            formatted += f"Truck: {delivery.truck_code} ({delivery.truck_plate})\n"
            formatted += f"  Date: {delivery.delivery_date}\n"

        return formatted

    def _format_weather_data(self, weather: WeatherResult) -> str:
        """Format weather data using standardized models"""
        formatted = "Current Weather Conditions:\n"
        formatted += (
            f"From {weather.from_location.city}: {weather.from_location.temp_c}°C, "
        )
        formatted += f"{weather.from_location.condition}, Wind: {weather.from_location.wind_kph} km/h\n"
        formatted += f"To {weather.to_location.city}: {weather.to_location.temp_c}°C, "
        formatted += f"{weather.to_location.condition}, Wind: {weather.to_location.wind_kph} km/h\n"
        return formatted
