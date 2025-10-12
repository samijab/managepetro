# Data Mapping Fix Documentation

## Problem Statement
Frontend components were not receiving the correct data structure from backend APIs, causing:
1. Route optimization page not displaying trucks, fuel stations, and other data
2. Dispatcher page showing empty lists
3. Stations page not displaying data

## Root Cause
Backend `to_api_dict()` methods were only returning formatted strings (e.g., "50,000 L") without the raw numeric values that frontend components needed. Additionally, ID fields required for React keys were missing.

## Solution
Updated all `to_api_dict()` methods in `backend/models/data_models.py` to include both raw and formatted data.

## Data Mapping Details

### StationData.to_api_dict()
**Frontend Requirements** (from FuelStationsCard, StationNeedsCard):
- `station_id` - for React keys
- `name` - station name
- `city`, `region` - location info
- `fuel_level` - percentage (number)
- `capacity_liters` - raw capacity (number)
- `current_level_liters` - raw current level (number)
- `fuel_type` - fuel type string
- `lat`, `lon` - coordinates (numbers)
- `request_method` - IoT or Manual

**Backend Now Provides**:
```javascript
{
  "station_id": "station-001",        // NEW - for React keys
  "name": "Test Station",
  "code": "STN-001",
  "city": "Toronto",                  // NEW - raw value
  "region": "Ontario",                // NEW - raw value
  "location": "Toronto, Ontario",     // formatted
  "fuel_type": "Diesel",
  "fuel_level": 50,                   // NEW - percentage (number)
  "capacity_liters": 50000,           // NEW - raw value (number)
  "current_level_liters": 25000,      // NEW - raw value (number)
  "capacity": "50,000 L",             // formatted
  "current_level": "25,000 L",        // formatted
  "lat": 43.65,                       // NEW - raw coordinate
  "lon": -79.38,                      // NEW - raw coordinate
  "coordinates": {"lat": 43.65, "lon": -79.38},
  "request_method": "IoT",
  "needs_refuel": true,
  "availability": "Low Stock"
}
```

### TruckData.to_api_dict()
**Frontend Requirements** (from AvailableTrucksCard, TruckDispatchCard):
- `truck_id` - for React keys
- `plate_number` - truck license plate
- `code` - truck code
- `status` - active/maintenance/offline
- `capacity_liters` - raw capacity (number)
- `fuel_level_percent` - percentage (number)
- `fuel_type` - fuel type string
- `compartments` - array of compartment data

**Backend Now Provides**:
```javascript
{
  "truck_id": "truck-001",              // NEW - for React keys
  "code": "TRK-001",
  "plate_number": "ABC123",             // NEW - raw value
  "plate": "ABC123",                    // alias
  "capacity_liters": 30000,             // NEW - raw value (number)
  "fuel_capacity": "30,000 L",          // formatted
  "fuel_level_percent": 75,             // NEW - raw value (number)
  "fuel_level": "75%",                  // formatted
  "fuel_type": "Diesel",
  "status": "active",                   // NEW - lowercase for frontend
  "compartments": [...]                 // array of compartments
}
```

### DeliveryData.to_api_dict()
**Frontend Requirements** (from RecentDeliveriesCard):
- `delivery_id` - for React keys
- `station` - formatted station name
- `location` - formatted location
- `volume` - formatted volume
- `date` - delivery date
- `status` - delivery status
- `truck` - formatted truck info

**Backend Now Provides**:
```javascript
{
  "delivery_id": "delivery-001",        // NEW - for React keys
  "station_name": "Test Station",       // NEW - raw value
  "station_code": "STN-001",            // NEW - raw value
  "station": "Test Station (STN-001)",  // formatted
  "city": "Toronto",                    // NEW - raw value
  "region": "Ontario",                  // NEW - raw value
  "location": "Toronto, Ontario",       // formatted
  "volume_liters": 20000,               // NEW - raw value (number)
  "volume": "20,000 L",                 // formatted
  "date": "2025-10-12...",              // formatted string
  "delivery_date": "2025-10-12...",     // alias
  "status": "Completed",
  "truck_code": "TRK-001",              // NEW - raw value
  "truck_plate": "ABC123",              // NEW - raw value
  "truck": "TRK-001 (ABC123)",          // formatted
  "coordinates": {"lat": 43.65, "lon": -79.38}
}
```

## API Endpoints Affected

### 1. `/api/stations` 
Returns stations with all required fields for StationsPage and DispatcherPage.

### 2. `/api/trucks`
Returns trucks with all required fields for DispatcherPage and route optimization.

### 3. `/api/routes/optimize`
Uses `to_api_dict()` methods for:
- `fuel_stations` - list of stations
- `available_trucks` - list of trucks
- `recent_deliveries` - list of deliveries

These are all consumed by RoutePage components:
- FuelStationsCard
- AvailableTrucksCard
- RecentDeliveriesCard

## Component Verification

### RoutePage Components:
✅ **FuelStationsCard** - uses `station.city`, `station.region`, `station.capacity_liters`, `station.fuel_level`
✅ **AvailableTrucksCard** - uses `truck.truck_id`, `truck.plate_number`, `truck.status`, `truck.capacity_liters`
✅ **RecentDeliveriesCard** - uses `delivery.station`, `delivery.location`, `delivery.volume`, `delivery.truck`
✅ **DataSourcesCard** - uses `dataSources.database_stations`, `dataSources.available_trucks`, etc.

### DispatcherPage Components:
✅ **TruckDispatchCard** - uses `truck.code`, `truck.plate_number`, `truck.status`, `truck.fuel_level_percent`, `truck.compartments`
✅ **StationNeedsCard** - uses `station.name`, `station.city`, `station.region`, `station.capacity_liters`, `station.current_level_liters`, `station.fuel_level`

### StationsPage:
✅ **DynamicTable** - uses `station.id` (mapped from station_id), `station.name`, `station.fuel_level`, `station.city`

## Testing Performed

1. ✅ Verified Python data models load without errors
2. ✅ Tested `to_api_dict()` methods return correct structure
3. ✅ Verified all required fields are present in output
4. ✅ Confirmed frontend components expect the fields we now provide

## Breaking Changes

**None.** All changes are additive - we added new fields while keeping the existing formatted fields for backward compatibility.

## Summary

The fix ensures that:
1. All components receive the raw numeric data they need
2. React keys (station_id, truck_id, delivery_id) are provided
3. Both raw and formatted data are available for flexibility
4. Status fields use correct casing (lowercase for truck status)
5. Location data is provided in both raw (city, region) and formatted (location) forms
