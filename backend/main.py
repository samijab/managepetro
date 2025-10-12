from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ConfigDict

# Import your services
from services.llm_service import LLMService
from services.api_utils import get_weather, calculate_route, calculate_reachable_range


app = FastAPI(
    title="Manage Petro API",
    description="API for managing fuel delivery operations with AI-powered route optimization",
    version="1.0.0",
)

# Initialize services
llm_service = LLMService()


# Pydantic models for request/response (Updated for Pydantic v2)
class RouteRequest(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True, validate_assignment=True, extra="forbid"
    )

    from_location: str = Field(
        ..., min_length=2, max_length=100, description="Starting location"
    )
    to_location: str = Field(
        ..., min_length=2, max_length=100, description="Destination location"
    )
    llm_model: str = Field(default="gemini-2.5-flash", description="AI model to use")
    use_ai_optimization: bool = Field(
        default=True, description="Enable AI-powered optimization"
    )


class WeatherRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    city: str = Field(
        ..., min_length=1, max_length=50, description="City name for weather data"
    )


class TomTomRouteRequest(BaseModel):
    model_config = ConfigDict(validate_assignment=True)

    origin_lat: float = Field(..., ge=-90, le=90, description="Origin latitude")
    origin_lon: float = Field(..., ge=-180, le=180, description="Origin longitude")
    dest_lat: float = Field(..., ge=-90, le=90, description="Destination latitude")
    dest_lon: float = Field(..., ge=-180, le=180, description="Destination longitude")
    travel_mode: str = Field(default="car", description="Travel mode")
    route_type: str = Field(default="fastest", description="Route optimization type")


class ReachableRangeRequest(BaseModel):
    model_config = ConfigDict(validate_assignment=True)

    origin_lat: float = Field(..., ge=-90, le=90, description="Origin latitude")
    origin_lon: float = Field(..., ge=-180, le=180, description="Origin longitude")
    budget_value: float = Field(
        ..., gt=0, description="Budget value for range calculation"
    )
    budget_type: str = Field(
        default="distance",
        pattern="^(distance|time|fuel|energy)$",
        description="Budget type",
    )


@app.post("/api/routes/optimize")
async def optimize_route_ai(request: RouteRequest):
    """AI-powered route optimization using markdown-refined prompts"""
    try:
        if request.use_ai_optimization:
            # Use AI service with markdown refinement
            result = await llm_service.optimize_route(
                request.from_location, request.to_location, request.llm_model
            )
            return result
        else:
            # Fallback to basic response
            return {
                "message": "AI optimization disabled",
                "from_location": request.from_location,
                "to_location": request.to_location,
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Weather endpoint (refactored)
@app.post("/api/weather")
def get_weather_info(request: WeatherRequest):
    """Get current weather information for a city"""
    try:
        weather_data = get_weather(request.city)
        return {
            "city": request.city,
            "weather": weather_data.to_dict(),
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather service error: {str(e)}")


# TomTom route endpoint (refactored)
@app.post("/api/routes/tomtom")
def calculate_tomtom_route(request: TomTomRouteRequest):
    """Calculate route using TomTom API"""
    try:
        origin = (request.origin_lat, request.origin_lon)
        destination = (request.dest_lat, request.dest_lon)

        route_data = calculate_route(
            origin=origin,
            destination=destination,
            travelMode=request.travel_mode,
            routeType=request.route_type,
        )

        return {"origin": origin, "destination": destination, "route_data": route_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TomTom routing error: {str(e)}")


# Reachable range endpoint (refactored)
@app.post("/api/routes/reachable-range")
def calculate_range(request: ReachableRangeRequest):
    """Calculate reachable range using TomTom API"""
    try:
        origin = (request.origin_lat, request.origin_lon)

        range_data = calculate_reachable_range(
            origin=origin,
            budget_value=request.budget_value,
            budget_type=request.budget_type,
        )

        return {
            "origin": origin,
            "budget_type": request.budget_type,
            "budget_value": request.budget_value,
            "range_data": range_data,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reachable range error: {str(e)}")


# Stations endpoint
@app.get("/api/stations")
def get_stations():
    """Get all stations from database"""
    try:
        stations = llm_service._get_database_data("", "").stations
        return {
            "stations": [
                {
                    "station_id": f"station-{station.id:03d}",
                    "name": station.name,
                    "city": station.city,
                    "region": station.region,
                    "country": "Canada",
                    "fuel_type": station.fuel_type,
                    "capacity_liters": station.capacity_liters,
                    "current_level_liters": station.current_level_liters,
                    "fuel_level": int((station.current_level_liters / station.capacity_liters) * 100) if station.capacity_liters > 0 else 0,
                    "code": station.code,
                    "lat": float(station.lat),
                    "lon": float(station.lon),
                }
                for station in stations
            ],
            "count": len(stations),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stations: {str(e)}")


# Trucks endpoint
@app.get("/api/trucks")
def get_trucks():
    """Get all trucks from database"""
    try:
        trucks = llm_service._get_database_data("", "").trucks
        return {
            "trucks": [
                {
                    "truck_id": f"truck-{truck.id:03d}",
                    "plate_number": truck.plate,
                    "capacity_liters": truck.capacity_liters,
                    "fuel_level_percent": truck.fuel_level_percent,
                    "fuel_type": truck.fuel_type,
                    "status": truck.status,
                    "code": truck.code,
                }
                for truck in trucks
            ],
            "count": len(trucks),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch trucks: {str(e)}")


# Health check endpoint
@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "ai_optimization": "available",
            "weather_api": "available",
            "tomtom_routing": "available",
        },
    }
