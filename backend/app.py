from fastapi import FastAPI, Request
from dotenv import load_dotenv
from google.genai import types
import os
from google import genai
import requests
from datetime import datetime 
#imports gemeni key
load_dotenv()

client = genai.Client(api_key=os.getenv("gemenikey"))

gemeniTest = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="explain traffic patterns in vancouver bc",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0)
    ),
)

print(gemeniTest.text)

#WEATHER API
API_KEY = "d001fb8e247c4e4ab1b40950251010"

def get_weather(city):
    if city is None or not str(city).strip():
        raise ValueError("City parameter must not be None or empty.")
    url = f"https://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return {
            "temp_c": data["current"]["temp_c"],
            "condition": data["current"]["condition"]["text"],
            "wind_kph": data["current"]["wind_kph"]
        }

    else:
        raise Exception(f"Weather API error: {response.status_code} {response.text}")
    

#Routes 
TOMTOM_API_KEY = "swR56X5HtTayLAASqunc560B2xErmQFq"

def calculate_route(origin,destination, waypoints=None, **options):
    """
    Call TomTom’s Calculate Route API.
    
    origin: tuple (lat, lon)
    destination: tuple (lat, lon)
    waypoints: list of (lat, lon) intermediate points, or None
    options: extra params like travelMode, routeType, traffic, etc.
    
    Returns: parsed JSON, or raises exception
    """

    # Build the locations path
    # E.g. "lat1,lon1:lat2,lon2" or with waypoints "lat1,lon1:wp1_lat,wp1_lon:...:lat2,lon2"
    parts = []
    parts.append(f"{origin[0]},{origin[1]}")
    if waypoints:
        for wp in waypoints:
            parts.append(f"{wp[0]},{wp[1]}")
    parts.append(f"{destination[0]},{destination[1]}")
    locations = ":".join(parts)
    
    base_url = "https://api.tomtom.com/routing/1/calculateRoute"
    content_type = "json"  # we want JSON response
    url = f"{base_url}/{locations}/{content_type}"
    
    # Prepare query parameters
    params = {
        "key": TOMTOM_API_KEY,
        # you can include defaults or allow override via options
        "traffic": True,
        "routeType": "fastest",
    }
    # Add/override with options provided
    for k, v in options.items():
        params[k] = v
    
    resp = requests.get(url, params=params)
    if resp.status_code != 200:
        raise Exception(f"TomTom API error {resp.status_code}: {resp.text}")
    
    data = resp.json()
    # Optionally verify the structure
    return data

#range
def calculate_reachable_range(origin, budget_value, budget_type="distance", **options):
    """
    Call TomTom's Calculate Reachable Range API.
    
    origin: tuple (lat, lon)
    budget_type: one of "distance", "time", "fuel", "energy"
    budget_value: the numeric value for that budget
    options: other optional parameters (routeType, travelMode, consumption model, etc.)
    
    Returns parsed JSON response or raises on error.
    """
    # Build path part: origin point
    # Format: {lat},{lon}
    origin_str = f"{origin[0]},{origin[1]}"
    base_url = "https://api.tomtom.com/routing/1/calculateReachableRange"
    content_type = "json"
    url = f"{base_url}/{origin_str}/{content_type}"

    # Build query parameters
    params = {
        "key": TOMTOM_API_KEY
    }

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
        raise ValueError("Invalid budget_type — must be one of distance, time, fuel, energy")

    # Add the optional parameters the user passed
    for k, v in options.items():
        params[k] = v

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f"TomTom reachable range API error {response.status_code}: {response.text}")

    return response.json()