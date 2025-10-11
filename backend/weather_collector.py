import os
import time
import requests
import mysql.connector
from datetime import datetime

API_KEY = "d001fb8e247c4e4ab1b40950251010"
CITY = "Vancouver"

DB_HOST = os.getenv("DB_HOST", "db")
DB_NAME = os.getenv("DB_NAME", "weather")
DB_USER = os.getenv("DB_USER", "myuser")
DB_PASS = os.getenv("DB_PASS", "mypassword")

def fetch_weather():
    url = f"https://api.weatherapi.com/v1/current.json?key={API_KEY}&q={CITY}"
    r = requests.get(url)
    r.raise_for_status()
    data = r.json()
    return {
        "city": data["location"]["name"],
        "temp": data["current"]["temp_c"],
        "condition": data["current"]["condition"]["text"],
        "wind": data["current"]["wind_kph"],
        "humidity": data["current"]["humidity"],
        "time": datetime.now()
    }

def save_to_db(weather):
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO weather_data (city, temperature, condition, wind, humidity, collected_at)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        weather["city"],
        weather["temp"],
        weather["condition"],
        weather["wind"],
        weather["humidity"],
        weather["time"]
    ))
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    while True:
        weather = fetch_weather()
        save_to_db(weather)
        print(" Weather data inserted:", weather)
        time.sleep(3600)  # every 60 minutes