from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class WeatherData:
    """Standardized weather data structure"""

    city: str
    temp_c: float
    condition: str
    wind_kph: float
    humidity: float
    location: Optional[str] = None

    def __post_init__(self):
        """Set location alias"""
        if not self.location:
            self.location = self.city

    @classmethod
    def from_api_response(cls, data: Dict[str, Any]) -> "WeatherData":
        """Create from WeatherAPI response"""
        return cls(
            city=data["location"]["name"],
            temp_c=data["current"]["temp_c"],
            condition=data["current"]["condition"]["text"],
            wind_kph=data["current"]["wind_kph"],
            humidity=data["current"]["humidity"],
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API responses"""
        return {
            "city": self.city,
            "location": self.location,  # For backward compatibility
            "temp_c": self.temp_c,
            "condition": self.condition,
            "wind_kph": self.wind_kph,
            "humidity": self.humidity,
        }

    def to_db_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for database storage"""
        return {
            "city": self.city,
            "temperature": self.temp_c,  # DB field name
            "condition": self.condition,
            "wind": self.wind_kph,  # DB field name
            "humidity": self.humidity,
            "collected_at": datetime.now(),
        }


@dataclass
class StationData:
    """Standardized fuel station data"""

    id: int
    code: str
    name: str
    city: str
    region: str
    lat: float
    lon: float
    fuel_type: str
    capacity_liters: int
    current_level_liters: int
    request_method: Optional[str] = "Manual"
    low_fuel_threshold: Optional[int] = 5000

    @property
    def availability(self) -> str:
        """Calculate availability status"""
        return "Available" if self.current_level_liters > 5000 else "Low Stock"

    @property
    def coordinates(self) -> Dict[str, float]:
        """Get coordinates as dict"""
        return {"lat": self.lat, "lon": self.lon}
    
    @property
    def needs_refuel(self) -> bool:
        """Check if station needs refuelling"""
        threshold = self.low_fuel_threshold or 5000
        return self.current_level_liters < threshold

    def to_api_dict(self) -> Dict[str, Any]:
        """Convert to API response format"""
        return {
            "name": self.name,
            "code": self.code,
            "location": f"{self.city}, {self.region}",
            "fuel_type": self.fuel_type.title(),
            "capacity": f"{self.capacity_liters:,.0f} L",
            "current_level": f"{self.current_level_liters:,.0f} L",
            "availability": self.availability,
            "coordinates": self.coordinates,
            "request_method": self.request_method,
            "needs_refuel": self.needs_refuel,
        }


@dataclass
class DeliveryData:
    """Standardized delivery data"""

    id: int
    volume_liters: int
    delivery_date: datetime
    status: str
    station_name: str
    station_code: str
    city: str
    region: str
    lat: float
    lon: float
    truck_code: str
    truck_plate: str

    def to_api_dict(self) -> Dict[str, Any]:
        """Convert to API response format"""
        return {
            "delivery_id": self.id,
            "station": f"{self.station_name} ({self.station_code})",
            "location": f"{self.city}, {self.region}",
            "volume": f"{self.volume_liters:,.0f} L",
            "date": str(self.delivery_date),
            "status": self.status.title(),
            "truck": f"{self.truck_code} ({self.truck_plate})",
            "coordinates": {"lat": self.lat, "lon": self.lon},
        }


@dataclass
class TruckData:
    """Standardized truck data"""

    id: int
    code: str
    plate: str
    capacity_liters: int
    fuel_level_percent: int
    fuel_type: str
    status: str
    compartments: Optional[List[Dict[str, Any]]] = None

    def to_api_dict(self) -> Dict[str, Any]:
        """Convert to API response format"""
        return {
            "code": self.code,
            "plate": self.plate,
            "fuel_capacity": f"{self.capacity_liters:,.0f} L",
            "fuel_level": f"{self.fuel_level_percent}%",
            "fuel_type": self.fuel_type.title(),
            "status": self.status.title(),
            "compartments": self.compartments or [],
        }


class DatabaseResult:
    """Container for all database query results"""

    def __init__(
        self,
        stations: List[StationData],
        deliveries: List[DeliveryData],
        trucks: List[TruckData],
    ):
        self.stations = stations
        self.deliveries = deliveries
        self.trucks = trucks

    def to_counts_dict(self) -> Dict[str, int]:
        """Get data source counts"""
        return {
            "database_stations": len(self.stations),
            "recent_deliveries": len(self.deliveries),
            "available_trucks": len(self.trucks),
        }


class WeatherResult:
    """Container for weather data from multiple locations"""

    def __init__(self, from_location: WeatherData, to_location: WeatherData):
        self.from_location = from_location
        self.to_location = to_location

    def to_dict(self) -> Dict[str, Dict]:
        """Convert to dictionary format"""
        return {
            "from_location": self.from_location.to_dict(),
            "to_location": self.to_location.to_dict(),
        }
