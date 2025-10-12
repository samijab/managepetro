from pathlib import Path
from datetime import datetime
from typing import List
from models.data_models import (
    StationData,
    DeliveryData,
    WeatherResult,
    TruckData,
    WeatherData,
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

        # Handle time parameters
        departure_time = kwargs.get("departure_time", "Not specified")
        arrival_time = kwargs.get("arrival_time", "Not specified")
        time_mode = kwargs.get("time_mode", "departure")

        variables = {
            "from_location": from_location,
            "to_location": to_location,
            "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "stations_data": stations_text,
            "historical_routes": historical_text,
            "weather_conditions": weather_text,
            "departure_time": departure_time,
            "arrival_time": arrival_time,
            "time_mode": time_mode,
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
            formatted += f"Current: {station.current_level_liters:,.0f} L ({station.fuel_level_percent}%)\n"
            formatted += f"  Priority: {station.priority_level}, "
            formatted += f"Needs Refuel: {'Yes' if station.needs_refuel else 'No'}\n"
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

    def format_dispatch_prompt(
        self,
        truck: TruckData,
        stations: List[StationData],
        depot_location: str,
        depot_weather: WeatherData,
    ) -> str:
        """Create dispatch optimization prompt using standardized data models"""
        template = self.load_template("dispatch_optimization")

        # Format compartments info
        compartments_text = self._format_compartments_data(truck)
        
        # Format stations info
        stations_text = self._format_dispatch_stations_data(stations)
        
        # Format depot weather
        weather_text = f"{depot_weather.condition}, {depot_weather.temp_c}°C, Wind: {depot_weather.wind_kph} km/h"

        variables = {
            "truck_code": truck.code,
            "truck_plate": truck.plate,
            "truck_status": truck.status,
            "truck_fuel_level": truck.fuel_level_percent,
            "truck_consumption_rate": truck.fuel_consumption_rate or 35.0,
            "truck_efficiency": truck.efficiency_rating,
            "truck_range": f"{truck.max_range_km:.1f}" if truck.max_range_km else "N/A",
            "compartments_info": compartments_text,
            "depot_location": depot_location,
            "depot_weather": weather_text,
            "stations_info": stations_text,
        }

        formatted_prompt = template
        for key, value in variables.items():
            formatted_prompt = formatted_prompt.replace(f"{{{key}}}", str(value))

        return formatted_prompt

    def _format_compartments_data(self, truck: TruckData) -> str:
        """Format truck compartment data"""
        if truck.compartments:
            formatted = ""
            for comp in truck.compartments:
                utilization = int((comp['current_level_liters'] / comp['capacity_liters']) * 100)
                formatted += f"  - Compartment {comp['compartment_number']}: {comp['fuel_type']} - "
                formatted += f"{comp['capacity_liters']} L capacity ({comp['current_level_liters']} L current, {utilization}% utilized)\n"
            return formatted.rstrip()
        else:
            return f"  - Single compartment: {truck.fuel_type} - {truck.capacity_liters} L"

    def _format_dispatch_stations_data(self, stations: List[StationData]) -> str:
        """Format stations needing fuel for dispatch"""
        if not stations:
            return "No stations requiring fuel delivery."

        formatted = ""
        for i, station in enumerate(stations, 1):
            fuel_percent = station.fuel_level_percent
            needed = station.capacity_liters - station.current_level_liters
            
            # Find nearby stations within 50 km
            nearby = []
            for other in stations:
                if other.id != station.id:
                    distance = station.distance_to(other)
                    if distance <= 50:
                        nearby.append(f"{other.name} ({other.code}) - {distance:.1f} km, {other.priority_level} priority")
            
            formatted += f"""
{i}. {station.name} ({station.code})
   - Location: {station.city}, {station.region}
   - Coordinates: {station.lat}, {station.lon}
   - Fuel Type: {station.fuel_type}
   - Current Level: {station.current_level_liters} L ({fuel_percent}%)
   - Capacity: {station.capacity_liters} L
   - Needed: {needed} L
   - Priority: {station.priority_level}
   - Request Method: {station.request_method}"""
            
            if nearby:
                formatted += f"\n   - Nearby Stations (within 50 km): {'; '.join(nearby[:3])}"  # Show up to 3 nearby
            
            formatted += "\n"
        
        return formatted.rstrip()
