import time
import requests
from sqlalchemy.exc import SQLAlchemyError
from models.data_models import WeatherData
from models.db_models import WeatherData as DBWeatherData
from config import config, get_db_session


def fetch_weather() -> WeatherData:
    """Fetch weather data using standardized model"""
    url = f"https://api.weatherapi.com/v1/current.json?key={config.WEATHER_API_KEY}&q={config.WEATHER_CITY}"

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()
        return WeatherData.from_api_response(data)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Weather API request failed: {str(e)}")
    except ValueError as e:
        raise Exception(f"Weather API response parsing failed: {str(e)}")


def save_to_db(weather: WeatherData):
    """Save weather data to database using standardized structure"""
    try:
        with get_db_session() as session:
            db_data = weather.to_db_dict()
            
            db_weather = DBWeatherData(
                city=db_data["city"],
                temperature=db_data["temperature"],
                condition=db_data["condition"],
                wind=db_data["wind"],
                humidity=db_data["humidity"],
                collected_at=db_data["collected_at"],
            )
            
            session.add(db_weather)
            # Session will commit automatically via context manager
            
    except SQLAlchemyError as e:
        print(f"Database error while saving weather data: {e}")
        raise


if __name__ == "__main__":
    while True:
        weather = fetch_weather()
        save_to_db(weather)
        print("Weather data inserted:", weather.to_dict())
        time.sleep(3600)
