import time
import requests
import mysql.connector
from models.data_models import WeatherData
from config import config


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
    db_config = config.get_db_config()
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor()

    db_data = weather.to_db_dict()
    cur.execute(
        """
        INSERT INTO weather_data (city, temperature, condition, wind, humidity, collected_at)
        VALUES (%s, %s, %s, %s, %s, %s)
    """,
        (
            db_data["city"],
            db_data["temperature"],
            db_data["condition"],
            db_data["wind"],
            db_data["humidity"],
            db_data["collected_at"],
        ),
    )

    conn.commit()
    cur.close()
    conn.close()


if __name__ == "__main__":
    while True:
        weather = fetch_weather()
        save_to_db(weather)
        print("Weather data inserted:", weather.to_dict())
        time.sleep(3600)
