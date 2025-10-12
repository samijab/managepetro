# Dispatcher Feature Documentation

## Overview

The Dispatcher feature is a comprehensive truck routing and fuel delivery optimization system that allows dispatchers to efficiently manage fuel deliveries to stations requiring refuelling.

## Key Features

### 1. Station Request Methods
- **IoT Auto-Request**: Stations with IoT devices automatically request fuel when levels drop below threshold
- **Manual Request**: Stations can manually request fuel delivery through staff
- Low fuel threshold configurable per station

### 2. Multi-Compartment Trucks
- Trucks can have 2-5 compartments
- Each compartment can carry different fuel types (diesel, gasoline, propane)
- Separate capacity and current level tracking per compartment
- Prevents mixing of fuel types in the same compartment

### 3. AI-Powered Route Optimization
The dispatcher leverages the existing AI optimization engine to:
- **Route Planning**: Creates optimized routes from depot to multiple stations
- **Fuel Type Matching**: Only includes stations matching truck's compartment fuel types
- **Capacity Planning**: Ensures truck has sufficient fuel for all deliveries
- **Complete Expenditure**: Aims to deliver all fuel by end of day
- **Priority-Based**: Stations with critically low fuel levels are prioritized
- **Weather Integration**: Considers current weather conditions for timing and safety
- **Distance Optimization**: Minimizes total distance while serving maximum stations

### 4. Visual Dashboard
- Real-time view of available trucks with status indicators
- List of stations requiring fuel with urgency levels
- Color-coded fuel level indicators
- Compartment-level detail view for each truck
- Interactive optimization buttons per truck

## Database Schema

### New Fields in `stations` Table
```sql
request_method ENUM('IoT', 'Manual') DEFAULT 'Manual'
low_fuel_threshold DECIMAL(12,2) DEFAULT 5000
```

### New `truck_compartments` Table
```sql
CREATE TABLE truck_compartments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  truck_id INT NOT NULL,
  compartment_number INT NOT NULL,
  fuel_type ENUM('diesel', 'gasoline', 'propane') NOT NULL,
  capacity_liters DECIMAL(12,2) NOT NULL,
  current_level_liters DECIMAL(12,2) DEFAULT 0,
  FOREIGN KEY (truck_id) REFERENCES trucks(id),
  UNIQUE KEY unique_truck_compartment (truck_id, compartment_number)
);
```

## API Endpoints

### GET `/api/trucks`
Returns all trucks with their compartment information.

**Response:**
```json
{
  "trucks": [
    {
      "truck_id": "truck-001",
      "code": "T01",
      "plate_number": "AB-1421",
      "status": "active",
      "fuel_level_percent": 85,
      "capacity_liters": 32000,
      "fuel_type": "diesel",
      "compartments": [
        {
          "compartment_number": 1,
          "fuel_type": "diesel",
          "capacity_liters": 16000,
          "current_level_liters": 14000
        }
      ]
    }
  ],
  "count": 8
}
```

### GET `/api/stations`
Returns all stations with request method and refuel status.

**Response:**
```json
{
  "stations": [
    {
      "station_id": "station-001",
      "name": "FuelLogic Toronto",
      "city": "Toronto",
      "region": "ON",
      "fuel_type": "diesel",
      "capacity_liters": 120000,
      "current_level_liters": 25000,
      "fuel_level": 20,
      "request_method": "IoT",
      "low_fuel_threshold": 30000,
      "needs_refuel": true,
      "lat": 43.651,
      "lon": -79.347
    }
  ],
  "count": 8
}
```

### POST `/api/dispatch/optimize`
Optimizes dispatch route for a specific truck.

**Request:**
```json
{
  "truck_id": "truck-001",
  "depot_location": "Toronto",
  "llm_model": "gemini-2.5-flash"
}
```

**Response:**
```json
{
  "dispatch_summary": {
    "total_stations": "3 stations",
    "total_distance": "245 km",
    "estimated_duration": "4 hours 30 minutes",
    "total_fuel": "85,000 L",
    "departure_time": "06:00 AM",
    "return_time": "10:30 AM"
  },
  "truck": {
    "truck_id": "truck-001",
    "code": "T01",
    "plate": "AB-1421",
    "compartments": [...]
  },
  "depot_location": "Toronto",
  "route_stops": [
    {
      "station": "FuelLogic Toronto - Toronto",
      "distance": "15 km",
      "fuel_delivery": "30,000 L (diesel)",
      "eta": "06:20 AM",
      "reason": "Critical - 20% fuel level"
    }
  ],
  "stations_available": [...],
  "ai_analysis": "Full AI analysis text..."
}
```

## Frontend Components

### DispatcherPage (`/dispatcher`)
Main dashboard page with:
- Statistics overview (available trucks, stations needing fuel, IoT requests)
- Grid layout with trucks on left, stations/results on right
- Real-time data fetching from API

### TruckDispatchCard
Displays individual truck with:
- Status badge (active/maintenance/offline)
- Fuel level progress bar
- Compartment details with fuel types
- "Optimize Dispatch" button
- Loading state during optimization

### StationNeedsCard
Shows stations requiring fuel:
- Request method badge (IoT/Manual)
- Color-coded fuel level (red < 25%, yellow < 50%, green >= 50%)
- Fuel needed calculation
- Location information

### DispatchResultCard
Displays optimization results:
- Dispatch summary statistics
- Numbered route stops with details
- Compartment allocation view
- Full AI analysis
- Scrollable modal design

## User Workflow

1. **View Dashboard**: Dispatcher opens `/dispatcher` page
2. **Review Needs**: See list of stations requiring fuel and their urgency
3. **Select Truck**: Choose an available truck based on:
   - Fuel types in compartments
   - Current fuel levels
   - Status (active only)
4. **Optimize**: Click "Optimize Dispatch" button
5. **Review Plan**: AI generates optimized route with:
   - Station sequence
   - Fuel delivery amounts per station
   - ETA for each stop
   - Weather considerations
   - Complete reasoning
6. **Execute**: Use the plan to dispatch the truck

## DRY Principles Applied

1. **Reusable Components**: All new components are self-contained and reusable
2. **Centralized API Calls**: Uses existing `Api` service for all backend communication
3. **Consistent Data Models**: Backend uses dataclasses for type safety and consistency
4. **Shared AI Service**: Leverages existing LLM optimization infrastructure
5. **Common Styling**: Uses existing Tailwind CSS classes and design patterns
6. **Error Handling**: Consistent error handling across all components

## Best Practices Followed

- ✅ **Type Safety**: PropTypes for all React components
- ✅ **Loading States**: Proper loading and optimizing states
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Accessibility**: Proper ARIA labels and semantic HTML
- ✅ **Performance**: Efficient re-renders with proper state management
- ✅ **Code Organization**: Clear separation of concerns
- ✅ **Documentation**: Inline comments and JSDoc where needed

## Testing Considerations

To test the dispatcher feature:

1. **Database Setup**:
   ```bash
   mysql -u mp_app -p manage_petro < backend/db/schema.sql
   mysql -u mp_app -p manage_petro < backend/db/seed.sql
   ```

2. **Backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

3. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access**: Navigate to `http://localhost:5173/dispatcher`

## Future Enhancements

Potential improvements for future iterations:
- Real-time truck GPS tracking
- Multi-day route planning
- Driver assignment integration
- Historical route analytics
- Fuel price optimization
- Traffic prediction integration
- Mobile app for drivers
- Push notifications for IoT alerts
- Route execution tracking
- Delivery confirmation workflow

## Dependencies

No new dependencies were added. The feature uses:
- Existing backend: FastAPI, MySQL connector, Google Gemini AI
- Existing frontend: React, React Router, Axios, Tailwind CSS, Heroicons
