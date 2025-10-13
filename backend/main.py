from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import timedelta

# Import your services
from services.llm_service import LLMService
from services.api_utils import get_weather, calculate_route, calculate_reachable_range
from services.auth_service import (
    auth_service,
    get_current_active_user,
)
from models.auth_models import UserCreate, User, Token
from config import config


app = FastAPI(
    title="Manage Petro API",
    description="API for managing fuel delivery operations with AI-powered route optimization",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development server
        "http://localhost:3001",  # Alternative React port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
llm_service = LLMService()


# Pydantic models for request/response (Updated for Pydantic v2)
class RouteRequest(BaseModel):
    model_config = {
        "str_strip_whitespace": True,
        "validate_assignment": True,
        "extra": "forbid",
    }

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
    departure_time: str | None = Field(
        default=None, description="Desired departure time (ISO format or HH:MM)"
    )
    arrival_time: str | None = Field(
        default=None, description="Desired arrival time (ISO format or HH:MM)"
    )
    time_mode: str = Field(
        default="departure",
        pattern="^(departure|arrival)$",
        description="Time optimization mode",
    )
    delivery_date: str | None = Field(
        default=None, description="Preferred delivery date (YYYY-MM-DD)"
    )
    vehicle_type: str = Field(
        default="fuel_delivery_truck", description="Type of vehicle for the route"
    )
    notes: str | None = Field(
        default=None, description="Additional notes or special instructions"
    )


class WeatherRequest(BaseModel):
    model_config = {"str_strip_whitespace": True}

    city: str = Field(
        ..., min_length=1, max_length=50, description="City name for weather data"
    )


class TomTomRouteRequest(BaseModel):
    model_config = {"validate_assignment": True}

    origin_lat: float = Field(..., ge=-90, le=90, description="Origin latitude")
    origin_lon: float = Field(..., ge=-180, le=180, description="Origin longitude")
    dest_lat: float = Field(..., ge=-90, le=90, description="Destination latitude")
    dest_lon: float = Field(..., ge=-180, le=180, description="Destination longitude")
    travel_mode: str = Field(default="car", description="Travel mode")
    route_type: str = Field(default="fastest", description="Route optimization type")


class ReachableRangeRequest(BaseModel):
    model_config = {"validate_assignment": True}

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


class DispatchOptimizationRequest(BaseModel):
    model_config = {"validate_assignment": True, "extra": "forbid"}

    truck_id: str = Field(..., description="Truck ID to dispatch")
    llm_model: str = Field(default="gemini-2.5-flash", description="AI model to use")
    depot_location: str = Field(
        default="Toronto", description="Starting depot location"
    )


@app.post("/api/routes/optimize")
async def optimize_route_ai(
    request: RouteRequest, current_user: User = Depends(get_current_active_user)
):
    """AI-powered route optimization using markdown-refined prompts (Protected)"""
    try:
        if request.use_ai_optimization:
            # Use AI service with markdown refinement
            result = await llm_service.optimize_route(
                request.from_location,
                request.to_location,
                request.llm_model,
                departure_time=request.departure_time,
                arrival_time=request.arrival_time,
                time_mode=request.time_mode,
                delivery_date=request.delivery_date,
                vehicle_type=request.vehicle_type,
                notes=request.notes,
            )
            # Add user info to response
            result["requested_by"] = current_user.username
            return result
        else:
            # Fallback to basic response
            return {
                "message": "AI optimization disabled",
                "from_location": request.from_location,
                "to_location": request.to_location,
                "requested_by": current_user.username,
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
        stations = llm_service.get_all_stations()
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
                    "fuel_level": (
                        int(
                            (station.current_level_liters / station.capacity_liters)
                            * 100
                        )
                        if station.capacity_liters > 0
                        else 0
                    ),
                    "code": station.code,
                    "lat": float(station.lat),
                    "lon": float(station.lon),
                    "request_method": station.request_method or "Manual",
                    "low_fuel_threshold": station.low_fuel_threshold or 5000,
                    "needs_refuel": station.needs_refuel,
                }
                for station in stations
            ],
            "count": len(stations),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch stations: {str(e)}"
        )


# Trucks endpoint
@app.get("/api/trucks")
def get_trucks():
    """Get all trucks from database"""
    try:
        trucks = llm_service.get_all_trucks()
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
                    "compartments": truck.compartments or [],
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


# ===== AUTHENTICATION ENDPOINTS =====


@app.post("/auth/register", response_model=User)
def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        user = auth_service.create_user(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password,
        )
        # Convert to User model (without hashed_password)
        return User(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            created_at=user.created_at,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@app.post("/auth/token", response_model=Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return JWT token"""
    try:
        user = auth_service.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=config.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth_service.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=int(access_token_expires.total_seconds()),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@app.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user


@app.post("/auth/logout")
async def logout_user():
    """Logout user (client should delete token)"""
    return {"message": "Successfully logged out"}


# ===== END AUTHENTICATION ENDPOINTS =====


# Dispatch optimization endpoint
@app.post("/api/dispatch/optimize")
async def optimize_dispatch(
    request: DispatchOptimizationRequest,
    current_user: User = Depends(get_current_active_user),
):
    """AI-powered dispatch optimization for trucks to stations needing fuel (Protected)"""
    try:
        result = await llm_service.optimize_dispatch(
            truck_id=request.truck_id,
            depot_location=request.depot_location,
            llm_model=request.llm_model,
        )
        # Add user info to response
        result["requested_by"] = current_user.username
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Dispatch optimization failed: {str(e)}"
        )
