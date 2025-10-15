#!/usr/bin/env python3
"""
Simple verification script to test SQLAlchemy integration.
This script validates that the refactored code can import correctly
and that the database models are properly defined.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all modules can be imported"""
    print("Testing imports...")
    
    try:
        from models.db_models import Base, User, Station, Truck, Delivery, WeatherData
        print("✓ Database models imported successfully")
    except Exception as e:
        print(f"✗ Failed to import database models: {e}")
        return False
    
    try:
        from models.auth_models import UserInDB, Token, User as AuthUser
        print("✓ Auth models imported successfully")
    except Exception as e:
        print(f"✗ Failed to import auth models: {e}")
        return False
    
    try:
        from models.data_models import StationData, TruckData, DeliveryData
        print("✓ Data models imported successfully")
    except Exception as e:
        print(f"✗ Failed to import data models: {e}")
        return False
    
    return True

def test_model_structure():
    """Test that models have expected attributes"""
    print("\nTesting model structure...")
    
    from models.db_models import User, Station, Truck, Delivery
    
    # Test User model
    expected_user_attrs = ['id', 'username', 'email', 'hashed_password', 'is_active', 'created_at']
    for attr in expected_user_attrs:
        if not hasattr(User, attr):
            print(f"✗ User model missing attribute: {attr}")
            return False
    print("✓ User model structure correct")
    
    # Test Station model
    expected_station_attrs = ['id', 'code', 'name', 'lat', 'lon', 'city', 'fuel_type', 'capacity_liters']
    for attr in expected_station_attrs:
        if not hasattr(Station, attr):
            print(f"✗ Station model missing attribute: {attr}")
            return False
    print("✓ Station model structure correct")
    
    # Test Truck model
    expected_truck_attrs = ['id', 'code', 'plate', 'capacity_liters', 'fuel_type', 'status']
    for attr in expected_truck_attrs:
        if not hasattr(Truck, attr):
            print(f"✗ Truck model missing attribute: {attr}")
            return False
    print("✓ Truck model structure correct")
    
    # Test Delivery model
    expected_delivery_attrs = ['id', 'truck_id', 'station_id', 'volume_liters', 'delivery_date', 'status']
    for attr in expected_delivery_attrs:
        if not hasattr(Delivery, attr):
            print(f"✗ Delivery model missing attribute: {attr}")
            return False
    print("✓ Delivery model structure correct")
    
    return True

def test_sqlalchemy_version():
    """Check SQLAlchemy version"""
    print("\nChecking SQLAlchemy version...")
    
    try:
        import sqlalchemy
        version = sqlalchemy.__version__
        print(f"✓ SQLAlchemy version: {version}")
        
        # Check for version 2.0+
        major_version = int(version.split('.')[0])
        if major_version >= 2:
            print("✓ Using SQLAlchemy 2.0+ (recommended)")
            return True
        else:
            print("⚠ SQLAlchemy version is older than 2.0")
            return True
    except Exception as e:
        print(f"✗ Failed to check SQLAlchemy version: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 70)
    print("SQLAlchemy Integration Verification")
    print("=" * 70)
    
    tests = [
        test_imports,
        test_model_structure,
        test_sqlalchemy_version,
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"✗ Test failed with exception: {e}")
            results.append(False)
    
    print("\n" + "=" * 70)
    if all(results):
        print("✓ All tests passed!")
        print("=" * 70)
        return 0
    else:
        print("✗ Some tests failed")
        print("=" * 70)
        return 1

if __name__ == "__main__":
    sys.exit(main())
