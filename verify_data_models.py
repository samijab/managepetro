#!/usr/bin/env python3
"""
Verification script to confirm backend data models match frontend expectations.

This script tests that the backend's data models produce the exact structure
that frontend components expect to consume.
"""

import sys
import json
from datetime import datetime

# Add backend to path
sys.path.insert(0, './backend')

from models.data_models import StationData, TruckData, DeliveryData

def test_station_data():
    """Test that StationData.to_api_dict() includes all required fields"""
    print("=" * 60)
    print("TESTING: StationData.to_api_dict()")
    print("=" * 60)
    
    station = StationData(
        id=1,
        code="STN-001",
        name="Test Station",
        city="Toronto",
        region="Ontario",
        lat=43.65,
        lon=-79.38,
        fuel_type="diesel",
        capacity_liters=50000,
        current_level_liters=25000,
        request_method="IoT",
        low_fuel_threshold=10000
    )
    
    result = station.to_api_dict()
    
    # Required fields for FuelStationsCard and StationNeedsCard
    required_fields = [
        'station_id',      # React key
        'name',            # Display
        'city',            # Location (raw)
        'region',          # Location (raw)
        'fuel_level',      # Percentage (number)
        'capacity_liters', # Raw capacity (number)
        'current_level_liters', # Raw level (number)
        'fuel_type',       # Type
        'lat',             # Coordinate
        'lon',             # Coordinate
    ]
    
    print("\n✓ Required Fields:")
    all_present = True
    for field in required_fields:
        if field in result:
            value = result[field]
            value_type = type(value).__name__
            print(f"  ✓ {field:<25} = {value} ({value_type})")
        else:
            print(f"  ✗ {field:<25} = MISSING")
            all_present = False
    
    # Check data types
    print("\n✓ Data Type Validation:")
    validations = [
        ('station_id', str),
        ('fuel_level', int),
        ('capacity_liters', int),
        ('current_level_liters', int),
        ('lat', float),
        ('lon', float),
    ]
    
    for field, expected_type in validations:
        if field in result:
            actual_type = type(result[field])
            if actual_type == expected_type:
                print(f"  ✓ {field:<25} is {expected_type.__name__}")
            else:
                print(f"  ✗ {field:<25} is {actual_type.__name__}, expected {expected_type.__name__}")
                all_present = False
    
    return all_present

def test_truck_data():
    """Test that TruckData.to_api_dict() includes all required fields"""
    print("\n" + "=" * 60)
    print("TESTING: TruckData.to_api_dict()")
    print("=" * 60)
    
    truck = TruckData(
        id=1,
        code="TRK-001",
        plate="ABC123",
        capacity_liters=30000,
        fuel_level_percent=75,
        fuel_type="diesel",
        status="active",
        compartments=[{
            "compartment_number": 1,
            "fuel_type": "diesel",
            "capacity_liters": 15000,
            "current_level_liters": 10000
        }]
    )
    
    result = truck.to_api_dict()
    
    # Required fields for AvailableTrucksCard and TruckDispatchCard
    required_fields = [
        'truck_id',          # React key
        'plate_number',      # Display
        'code',              # Display
        'status',            # Badge
        'capacity_liters',   # Raw capacity (number)
        'fuel_level_percent', # Percentage (number)
        'fuel_type',         # Type
        'compartments',      # Array
    ]
    
    print("\n✓ Required Fields:")
    all_present = True
    for field in required_fields:
        if field in result:
            value = result[field]
            if isinstance(value, (list, dict)):
                value_repr = f"<{type(value).__name__} with {len(value)} items>"
            else:
                value_repr = str(value)
            value_type = type(value).__name__
            print(f"  ✓ {field:<25} = {value_repr} ({value_type})")
        else:
            print(f"  ✗ {field:<25} = MISSING")
            all_present = False
    
    # Check data types
    print("\n✓ Data Type Validation:")
    validations = [
        ('truck_id', str),
        ('capacity_liters', int),
        ('fuel_level_percent', int),
        ('status', str),
        ('compartments', list),
    ]
    
    for field, expected_type in validations:
        if field in result:
            actual_type = type(result[field])
            if actual_type == expected_type:
                print(f"  ✓ {field:<25} is {expected_type.__name__}")
            else:
                print(f"  ✗ {field:<25} is {actual_type.__name__}, expected {expected_type.__name__}")
                all_present = False
    
    # Validate status is lowercase
    if result.get('status') == 'active':
        print(f"  ✓ status is lowercase (required by frontend)")
    else:
        print(f"  ✗ status should be lowercase, got: {result.get('status')}")
        all_present = False
    
    return all_present

def test_delivery_data():
    """Test that DeliveryData.to_api_dict() includes all required fields"""
    print("\n" + "=" * 60)
    print("TESTING: DeliveryData.to_api_dict()")
    print("=" * 60)
    
    delivery = DeliveryData(
        id=1,
        volume_liters=20000,
        delivery_date=datetime.now(),
        status="completed",
        station_name="Test Station",
        station_code="STN-001",
        city="Toronto",
        region="Ontario",
        lat=43.65,
        lon=-79.38,
        truck_code="TRK-001",
        truck_plate="ABC123"
    )
    
    result = delivery.to_api_dict()
    
    # Required fields for RecentDeliveriesCard
    required_fields = [
        'delivery_id',  # React key
        'station',      # Formatted display
        'location',     # Formatted display
        'volume',       # Formatted display
        'date',         # Date string
        'status',       # Status
        'truck',        # Formatted display
    ]
    
    print("\n✓ Required Fields:")
    all_present = True
    for field in required_fields:
        if field in result:
            value = result[field]
            value_type = type(value).__name__
            print(f"  ✓ {field:<25} = {value} ({value_type})")
        else:
            print(f"  ✗ {field:<25} = MISSING")
            all_present = False
    
    # Optional but useful raw fields
    print("\n✓ Optional Raw Fields (for flexibility):")
    optional_fields = ['volume_liters', 'city', 'region', 'delivery_date']
    for field in optional_fields:
        if field in result:
            print(f"  ✓ {field:<25} = {result[field]}")
        else:
            print(f"  - {field:<25} = not included")
    
    return all_present

def main():
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " BACKEND DATA MODEL VERIFICATION ".center(58) + "║")
    print("╚" + "=" * 58 + "╝")
    print()
    
    results = []
    
    # Test all models
    results.append(("StationData", test_station_data()))
    results.append(("TruckData", test_truck_data()))
    results.append(("DeliveryData", test_delivery_data()))
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    all_passed = True
    for model_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status} - {model_name}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✓ ALL TESTS PASSED")
        print("\nBackend data models are correctly configured to work with")
        print("frontend components. All required fields are present with")
        print("correct data types.")
    else:
        print("✗ SOME TESTS FAILED")
        print("\nSome required fields are missing or have incorrect types.")
        print("Review the output above to identify issues.")
    print("=" * 60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
