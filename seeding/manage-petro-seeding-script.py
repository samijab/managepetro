import random
import uuid
import json
import os
from datetime import datetime, timedelta

# Possible data pools
CITIES_CA = [
    "Toronto",
    "Vancouver",
    "Calgary",
    "Montreal",
    "Edmonton",
    "Winnipeg",
    "Halifax",
    "Ottawa",
]
CITIES_US = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Dallas",
    "Seattle",
    "Miami",
]

FUEL_TYPES = ["Gasoline", "Diesel", "Premium", "Ethanol", "Jet Fuel"]
REQUEST_METHODS = ["IoT", "Manual"]
TRAFFIC_CONDITIONS = ["Light", "Moderate", "Heavy"]
WEATHER_CONDITIONS = ["Clear", "Rain", "Snow", "Fog"]


# Helper functions
def random_date(start_days_ago=30, end_days_ago=0):
    """Generate a random datetime within the specified range."""
    start_date = datetime.now() - timedelta(days=start_days_ago)
    end_date = datetime.now() - timedelta(days=end_days_ago)
    random_delta = (end_date - start_date) * random.random()
    return start_date + random_delta


def generate_truck():
    """Generate a truck with random specifications."""
    num_compartments = random.randint(2, 5)
    compartments = []

    for i in range(num_compartments):
        compartments.append(
            {
                "compartment_id": i + 1,
                "fuel_type": random.choice(FUEL_TYPES),
                "max_capacity": random.randint(4000, 10000),
            }
        )

    total_capacity = sum(comp["max_capacity"] for comp in compartments)

    return {
        "truck_id": str(uuid.uuid4()),
        "plate_number": f"{random.choice(['CA', 'US'])}-{random.randint(10000, 99999)}",
        "capacity_liters": total_capacity,
        "compartments": compartments,
    }


def generate_gas_station():
    """Generate a gas station with random attributes."""
    country = random.choice(["Canada", "USA"])
    city = random.choice(CITIES_CA if country == "Canada" else CITIES_US)

    return {
        "station_id": str(uuid.uuid4()),
        "name": f"{city} Fuel Station {random.randint(1, 100)}",
        "city": city,
        "country": country,
        "request_method": random.choice(REQUEST_METHODS),
        "has_iot_device": random.choice([True, False]),
        "avg_daily_consumption_liters": random.randint(3000, 15000),
    }


def generate_trip(truck, station):
    """Generate a fuel delivery trip between a truck and station."""
    trip_date = random_date()
    distance_km = random.randint(10, 500)

    # Calculate estimated duration based on distance and speed
    avg_speed_kmh = random.uniform(40, 80)
    estimated_duration_hr = round(distance_km / avg_speed_kmh, 2)

    trip = {
        "trip_id": str(uuid.uuid4()),
        "truck_id": truck["truck_id"],
        "station_id": station["station_id"],
        "trip_date": trip_date.strftime("%Y-%m-%d %H:%M:%S"),
        "distance_km": distance_km,
        "fuel_delivered": [],
        "estimated_duration_hr": estimated_duration_hr,
        "traffic_conditions": random.choice(TRAFFIC_CONDITIONS),
        "weather_conditions": random.choice(WEATHER_CONDITIONS),
        "delivery_successful": random.choices([True, False], weights=[85, 15])[
            0
        ],  # 85% success rate
    }

    # Determine which compartments are used (at least 1)
    num_compartments_used = random.randint(1, len(truck["compartments"]))
    used_compartments = random.sample(truck["compartments"], num_compartments_used)

    for compartment in used_compartments:
        # Ensure delivered amount doesn't exceed compartment capacity
        max_delivery = compartment["max_capacity"]
        delivered_amount = random.randint(1000, max_delivery)

        trip["fuel_delivered"].append(
            {
                "compartment_id": compartment["compartment_id"],
                "fuel_type": compartment["fuel_type"],
                "liters": delivered_amount,
            }
        )

    return trip


def generate_data(num_trucks=10, num_stations=20, num_trips=50):
    """Generate complete seed data for the fuel delivery system."""
    print(f"Generating {num_trucks} trucks...")
    trucks = [generate_truck() for _ in range(num_trucks)]

    print(f"Generating {num_stations} gas stations...")
    stations = [generate_gas_station() for _ in range(num_stations)]

    print(f"Generating {num_trips} trips...")
    trips = []
    for _ in range(num_trips):
        truck = random.choice(trucks)
        station = random.choice(stations)
        trip = generate_trip(truck, station)
        trips.append(trip)

    return {
        "trucks": trucks,
        "stations": stations,
        "trips": trips,
        "metadata": {
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_trucks": len(trucks),
            "total_stations": len(stations),
            "total_trips": len(trips),
        },
    }


def save_data_to_file(data, filename="fuel_delivery_seed.json"):
    """Save the generated data to a JSON file."""
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, filename)

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"✓ Seed data successfully generated and saved to: {output_path}")
        return output_path
    except Exception as e:
        print(f"✗ Error saving data: {e}")
        return None


def print_summary(data):
    """Print a summary of the generated data."""
    print("\n" + "=" * 50)
    print("DATA GENERATION SUMMARY")
    print("=" * 50)
    print(f"Trucks generated: {len(data['trucks'])}")
    print(f"Gas stations generated: {len(data['stations'])}")
    print(f"Trips generated: {len(data['trips'])}")

    # Calculate some statistics
    successful_trips = sum(1 for trip in data["trips"] if trip["delivery_successful"])
    total_fuel_delivered = sum(
        sum(delivery["liters"] for delivery in trip["fuel_delivered"])
        for trip in data["trips"]
        if trip["delivery_successful"]
    )

    print(
        f"Successful deliveries: {successful_trips}/{len(data['trips'])} ({successful_trips/len(data['trips'])*100:.1f}%)"
    )
    print(f"Total fuel delivered: {total_fuel_delivered:,} liters")
    print("=" * 50)


if __name__ == "__main__":
    # Set random seed for reproducible results (optional)
    # random.seed(42)

    print("Starting fuel delivery data generation...")

    # Generate the data
    data = generate_data(num_trucks=15, num_stations=40, num_trips=100)

    # Save to file
    output_file = save_data_to_file(data)

    # Print summary
    if output_file:
        print_summary(data)
