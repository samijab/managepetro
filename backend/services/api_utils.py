from typing import Tuple, Dict, Any, List, Optional
import httpx
from models.data_models import WeatherData
from config import config


async def get_weather_async(city: str) -> WeatherData:
    """Async: Get current weather for a city using httpx AsyncClient."""
    if city is None or not str(city).strip():
        raise ValueError("City parameter must not be None or empty.")

    url = "https://api.weatherapi.com/v1/current.json"
    params = {"key": config.WEATHER_API_KEY, "q": city, "aqi": "no"}

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=10.0)
            resp.raise_for_status()
            data = resp.json()
            return WeatherData.from_api_response(data)
        except httpx.HTTPError as e:
            raise Exception(f"Weather API request failed: {str(e)}")
        except ValueError as e:
            raise Exception(f"Weather API response parsing failed: {str(e)}")


# TOMTOM ROUTING API
async def calculate_route_async(
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
        "key": config.TOMTOM_API_KEY,
        "traffic": True,
        "routeType": "fastest",
    }
    # Add/override with options provided
    params.update(options)

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=30.0)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPError as e:
            raise Exception(f"TomTom routing API request failed: {str(e)}")
        except ValueError as e:
            raise Exception(f"TomTom routing API response parsing failed: {str(e)}")


async def calculate_reachable_range_async(
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
    params = {"key": config.TOMTOM_API_KEY}

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
    params.update(options)

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=30.0)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPError as e:
            raise Exception(f"TomTom reachable range API request failed: {str(e)}")
        except ValueError as e:
            raise Exception(
                f"TomTom reachable range API response parsing failed: {str(e)}"
            )
