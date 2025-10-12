# Testing Guide for Data Consumption Fix

This document explains how to test the data consumption fixes for route optimization, dispatcher, and stations pages.

## What Was Fixed

The backend `to_api_dict()` methods now return both raw and formatted data to match frontend component expectations:

1. **Stations** - Include `station_id`, `fuel_level`, `city`, `region`, and raw numeric fields
2. **Trucks** - Include `truck_id`, `plate_number`, and raw numeric fields
3. **Deliveries** - Include `delivery_id` and raw numeric fields

## Testing Without Backend (Demo Mode)

### Route Optimization Demo Page

The application includes a demo page that uses mock data matching the new backend structure.

**To test:**

1. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Navigate to the Demo Route Page in your browser

3. Click "Show Demo" to see all components with sample data

4. **Verify these components display correctly:**
   - ✓ Fuel Stations Card - shows station names, locations, fuel levels
   - ✓ Available Trucks Card - shows truck IDs, plate numbers, status
   - ✓ Recent Deliveries Card - shows delivery history
   - ✓ Data Sources Card - shows data availability counts

**Expected Result:** All cards should display data without errors. No missing fields or undefined values.

## Testing With Backend (Full Integration)

### Prerequisites

1. Database must be running (Docker):
   ```bash
   cd backend
   docker-compose up -d
   ```

2. Environment variables must be set:
   - `gemenikey` - Google Gemini API key
   - `WEATHER_API_KEY` - Weather API key (has default)
   - `TOMTOM_API_KEY` - TomTom API key (has default)

3. Start backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   fastapi dev main.py
   ```

4. Start frontend (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

### Test Cases

#### Test 1: Route Optimization Page

1. Navigate to Route Optimization page
2. Enter "Toronto" as starting location
3. Enter "Montreal" as destination
4. Click "Calculate Route"

**Expected Result:**
- Route summary displays with distance and duration
- Turn-by-turn directions appear
- Fuel Stations Card shows nearby stations with:
  - Station names
  - City and region
  - Fuel levels (as percentage)
  - Capacity in liters
- Available Trucks Card shows trucks with:
  - Truck IDs (e.g., "truck-001")
  - Plate numbers
  - Status (active/maintenance/offline)
  - Fuel levels
- Recent Deliveries Card shows past deliveries
- Data Sources Card shows counts of available data

**Debug if it fails:**
- Check browser console for errors
- Check network tab for API response structure
- Verify backend returned data with new fields

#### Test 2: Dispatcher Page

1. Navigate to Dispatcher Dashboard

**Expected Result:**
- Stats cards show:
  - Number of available trucks
  - Number of stations needing fuel
  - Number of IoT auto-requests
- Left column lists all trucks with:
  - Truck codes
  - Plate numbers
  - Status badges
  - Fuel level bars
  - Compartment details (if applicable)
- Right column lists stations needing fuel with:
  - Station names
  - City and region
  - Fuel level bars
  - Current and capacity amounts
  - IoT/Manual badges

**Debug if empty:**
- Check if `/api/trucks` endpoint returns data
- Check if `/api/stations` endpoint returns data
- Verify database has sample data
- Check browser console for API errors

#### Test 3: Stations Page

1. Navigate to Stations page

**Expected Result:**
- Stats cards display:
  - Total stations count
  - High priority stations count
  - Low fuel stations count
  - Well stocked stations count
- Table displays all stations with:
  - Station names
  - Fuel type badges
  - Fuel level progress bars with percentages
  - Priority badges (High/Medium/Low)
  - Location (city)
  - Last delivery date

**Debug if empty:**
- Check if `/api/stations` endpoint returns data
- Verify database has sample data
- Check browser console for errors
- Check network tab for API response

### API Response Validation

Use the browser's Network tab to verify API responses have the correct structure:

#### `/api/stations` Response:
```json
{
  "stations": [
    {
      "station_id": "station-001",
      "name": "Test Station",
      "city": "Toronto",
      "region": "Ontario",
      "fuel_level": 50,
      "capacity_liters": 50000,
      "current_level_liters": 25000,
      "fuel_type": "Diesel",
      "lat": 43.65,
      "lon": -79.38,
      ...
    }
  ]
}
```

#### `/api/trucks` Response:
```json
{
  "trucks": [
    {
      "truck_id": "truck-001",
      "plate_number": "ABC123",
      "code": "TRK-001",
      "status": "active",
      "capacity_liters": 30000,
      "fuel_level_percent": 75,
      ...
    }
  ]
}
```

#### `/api/routes/optimize` Response:
```json
{
  "fuel_stations": [...],
  "available_trucks": [...],
  "recent_deliveries": [...],
  "route_summary": {...},
  "directions": [...],
  ...
}
```

## Common Issues and Solutions

### Issue: Fuel Stations Card is empty on route optimization page
**Solution:** Verify backend returns `fuel_stations` array with:
- `station_id` field
- `city` and `region` fields (not just `location`)
- `fuel_level` as a number (not formatted string)
- `capacity_liters` and `current_level_liters` as numbers

### Issue: Available Trucks Card is empty
**Solution:** Verify backend returns `available_trucks` array with:
- `truck_id` field
- `plate_number` field (not just `plate`)
- `status` as lowercase string ("active" not "Active")
- Raw numeric fields: `capacity_liters`, `fuel_level_percent`

### Issue: Dispatcher page shows 0 trucks and 0 stations
**Solution:**
1. Check if database is running: `docker ps`
2. Verify database has data: Connect to MySQL and check `trucks` and `stations` tables
3. Check backend logs for database connection errors
4. Verify API endpoints return data: `curl http://localhost:8000/api/trucks`

### Issue: Stations page is empty
**Solution:**
1. Same as dispatcher page issues
2. Verify StationsPage correctly maps `station.station_id` to `station.id`
3. Check if fuel_level calculation is working (should be percentage)

## Mock Data Reference

The frontend includes complete mock data in:
- `frontend/src/data/mockRouteResponse.js` - For route optimization
- `frontend/src/data/mockData.js` - For stations and trucks

These mock files show the exact structure that backend should return.

## Verification Checklist

Before marking this issue as complete, verify:

- [ ] Demo Route Page displays all components without errors
- [ ] Route Optimization page consumes and displays:
  - [ ] Fuel stations with all details
  - [ ] Available trucks with all details
  - [ ] Recent deliveries
  - [ ] Data sources
- [ ] Dispatcher page shows:
  - [ ] List of trucks with details
  - [ ] List of stations needing fuel
  - [ ] Correct stats in header cards
- [ ] Stations page shows:
  - [ ] Table with all stations
  - [ ] Correct fuel levels and priorities
  - [ ] Stats cards with counts
- [ ] No console errors related to missing fields
- [ ] No "undefined" or "NaN" values in UI
- [ ] All React keys are unique (no key warnings)

## Success Criteria

✅ **Pass:** All pages display data correctly with no errors or missing information
✅ **Pass:** Components render with proper data structure from backend
✅ **Pass:** No breaking changes - existing functionality still works
✅ **Pass:** Both raw and formatted data available for flexibility

❌ **Fail:** Any component shows "undefined" or missing data
❌ **Fail:** Console shows errors about missing properties
❌ **Fail:** React shows warnings about duplicate keys
❌ **Fail:** Pages remain empty when backend returns data
