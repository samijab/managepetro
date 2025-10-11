import requests
import os
from dotenv import load_dotenv
from typing import Tuple, Dict, Any, List, Optional
from models.data_models import WeatherData


load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "d001fb8e247c4e4ab1b40950251010")
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "swR56X5HtTayLAASqunc560B2xErmQFq")


def get_weather(city: str) -> WeatherData:
    """Get current weather for a city - returns standardized WeatherData"""
    if city is None or not str(city).strip():
        raise ValueError("City parameter must not be None or empty.")

    url = f"https://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={city}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return WeatherData.from_api_response(data)
    else:
        raise Exception(f"Weather API error: {response.status_code} {response.text}")


# TOMTOM ROUTING API
def calculate_route(
    origin: Tuple[float, float],
    destination: Tuple[float, float],
    waypoints: Optional[List[Tuple[float, float]]] = None,
    **options,
) -> Dict[str, Any]:
    """
    Call TomTom's Calculate Route API.

    origin: tuple (lat, lon)
    destination: tuple (lat, lon)
    waypoints: list of (lat, lon) intermediate points, or None
    options: extra params like travelMode, routeType, traffic, etc.

    Returns: parsed JSON, or raises exception
    """

    # Build the locations path
    parts = []
    parts.append(f"{origin[0]},{origin[1]}")
    if waypoints:
        for wp in waypoints:
            parts.append(f"{wp[0]},{wp[1]}")
    parts.append(f"{destination[0]},{destination[1]}")
    locations = ":".join(parts)

    base_url = "https://api.tomtom.com/routing/1/calculateRoute"
    content_type = "json"
    url = f"{base_url}/{locations}/{content_type}"

    # Prepare query parameters
    params = {
        "key": TOMTOM_API_KEY,
        "traffic": True,
        "routeType": "fastest",
    }
    # Add/override with options provided
    for k, v in options.items():
        params[k] = v

    resp = requests.get(url, params=params)
    if resp.status_code != 200:
        raise Exception(f"TomTom API error {resp.status_code}: {resp.text}")

    return resp.json()


def calculate_reachable_range(
    origin: Tuple[float, float],
    budget_value: float,
    budget_type: str = "distance",
    **options,
) -> Dict[str, Any]:
    """
    Call TomTom's Calculate Reachable Range API.

    origin: tuple (lat, lon)
    budget_type: one of "distance", "time", "fuel", "energy"
    budget_value: the numeric value for that budget
    options: other optional parameters

    Returns parsed JSON response or raises on error.
    """
    origin_str = f"{origin[0]},{origin[1]}"
    base_url = "https://api.tomtom.com/routing/1/calculateReachableRange"
    content_type = "json"
    url = f"{base_url}/{origin_str}/{content_type}"

    # Build query parameters
    params = {"key": TOMTOM_API_KEY}

    # Set exactly one budget parameter
    if budget_type == "distance":
        params["distanceBudgetInMeters"] = budget_value
    elif budget_type == "time":
        params["timeBudgetInSec"] = budget_value
    elif budget_type == "fuel":
        params["fuelBudgetInLiters"] = budget_value
    elif budget_type == "energy":
        params["energyBudgetInkWh"] = budget_value
    else:
        raise ValueError(
            "Invalid budget_type — must be one of distance, time, fuel, energy"
        )

    # Add the optional parameters
    for k, v in options.items():
        params[k] = v

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(
            f"TomTom reachable range API error {response.status_code}: {response.text}"
        )

    return response.json()
