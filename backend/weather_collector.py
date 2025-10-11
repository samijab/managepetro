import os
import time
import requests
import mysql.connector
from models.data_models import WeatherData

API_KEY = "d001fb8e247c4e4ab1b40950251010"
CITY = "Vancouver"

# Database config
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "manage_petro")
DB_USER = os.getenv("DB_USER", "mp_app")
DB_PASS = os.getenv("DB_PASS", "devpass")


def fetch_weather() -> WeatherData:
    """Fetch weather data using standardized model"""
    url = f"https://api.weatherapi.com/v1/current.json?key={API_KEY}&q={CITY}"
    r = requests.get(url)
    r.raise_for_status()
    data = r.json()
    return WeatherData.from_api_response(data)


def save_to_db(weather: WeatherData):
    """Save weather data to database using standardized structure"""
    conn = mysql.connector.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME
    )
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
