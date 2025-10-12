// Mock API Response Demo
// This file demonstrates the structure of data returned by the optimize route API
// and consumed by the new frontend components

export const mockOptimizedRouteResponse = {
  route_summary: {
    from: "Toronto, ON",
    to: "Montreal, QC",
    total_distance: "542 km",
    estimated_duration: "5 hours 30 minutes",
    duration_with_traffic: "6 hours 15 minutes",
    primary_route: "Highway 401 East → Highway 20 East",
    route_type: "AI Optimized - Fastest with fuel efficiency",
    best_departure_time: "Early morning (6:00 AM) to avoid peak traffic",
    weather_impact: "Clear conditions, minimal impact expected",
    fuel_stops: "1 recommended stop in Kingston",
    estimated_fuel_cost: "$180 - $220 CAD",
    ai_generated: true,
    optimization_factors: [
      "Real-time weather",
      "Fuel station inventory",
      "Historical delivery data",
      "Traffic patterns",
      "Fuel efficiency"
    ]
  },
  
  directions: [
    {
      step: 1,
      instruction: "Head east on Highway 401 from Toronto",
      distance: "178 km",
      duration: "1 hour 45 minutes",
      maneuver: "straight",
      direction_type: "straight",
      compass_direction: "E"
    },
    {
      step: 2,
      instruction: "Continue on Highway 401 toward Kingston",
      distance: "95 km",
      duration: "55 minutes",
      maneuver: "straight",
      direction_type: "continue",
      compass_direction: "E"
    },
    {
      step: 3,
      instruction: "Take exit 721 to merge onto Highway 416 North",
      distance: "42 km",
      duration: "28 minutes",
      maneuver: "exit-right",
      direction_type: "exit_right",
      compass_direction: "N"
    },
    {
      step: 4,
      instruction: "Merge onto Highway 417 East toward Ottawa",
      distance: "89 km",
      duration: "52 minutes",
      maneuver: "merge-right",
      direction_type: "merge_right",
      compass_direction: "E"
    },
    {
      step: 5,
      instruction: "Take Highway 20 East toward Montreal",
      distance: "138 km",
      duration: "1 hour 30 minutes",
      maneuver: "turn-right",
      direction_type: "turn_right",
      compass_direction: "E"
    },
    {
      step: 6,
      instruction: "Arrive at destination in Montreal",
      distance: "0 km",
      duration: "0 minutes",
      maneuver: "arrive",
      direction_type: "destination",
      compass_direction: null
    }
  ],

  weather_impact: {
    from_location: {
      city: "Toronto",
      temperature: "18°C",
      condition: "Partly Cloudy",
      wind: "15 km/h NW",
      visibility: "Good"
    },
    to_location: {
      city: "Montreal",
      temperature: "16°C",
      condition: "Clear",
      wind: "12 km/h W",
      visibility: "Good"
    },
    route_impact: "Weather conditions are favorable for travel. No significant delays expected.",
    driving_conditions: "Normal"
  },

  traffic_conditions: {
    current_traffic: "Light to moderate on most sections",
    typical_time: "5 hours 30 minutes without delays",
    best_departure: "6:00 AM or after 9:00 PM to avoid rush hour",
    delays: "15-30 minutes expected during peak hours (7-9 AM, 4-6 PM)",
    ai_analysis: true
  },

  fuel_stations: [
    {
      station_id: "station-001",
      name: "Petro-Canada - Kingston East",
      city: "Kingston",
      region: "Ontario",
      fuel_type: "Diesel",
      capacity_liters: 50000,
      current_level_liters: 42000,
      fuel_level: 84,
      lat: 44.2312,
      lon: -76.4860
    },
    {
      station_id: "station-002",
      name: "Shell - Highway 401 Service Centre",
      city: "Port Hope",
      region: "Ontario",
      fuel_type: "Diesel",
      capacity_liters: 45000,
      current_level_liters: 28000,
      fuel_level: 62,
      lat: 43.9583,
      lon: -78.2940
    },
    {
      station_id: "station-003",
      name: "Esso - Cornwall Station",
      city: "Cornwall",
      region: "Ontario",
      fuel_type: "Diesel",
      capacity_liters: 40000,
      current_level_liters: 15000,
      fuel_level: 38,
      lat: 45.0211,
      lon: -74.7300
    },
    {
      station_id: "station-004",
      name: "Ultramar - Montreal West",
      city: "Montreal",
      region: "Quebec",
      fuel_type: "Diesel",
      capacity_liters: 60000,
      current_level_liters: 51000,
      fuel_level: 85,
      lat: 45.4642,
      lon: -73.6100
    },
    {
      station_id: "station-005",
      name: "Petro-Canada - Belleville",
      city: "Belleville",
      region: "Ontario",
      fuel_type: "Diesel",
      capacity_liters: 35000,
      current_level_liters: 8500,
      fuel_level: 24,
      lat: 44.1628,
      lon: -77.3832
    }
  ],

  available_trucks: [
    {
      truck_id: "truck-001",
      plate_number: "ON-T4567",
      code: "TRK-001",
      capacity_liters: 35000,
      fuel_level_percent: 85,
      fuel_type: "Diesel",
      status: "active"
    },
    {
      truck_id: "truck-002",
      plate_number: "ON-T4892",
      code: "TRK-002",
      capacity_liters: 40000,
      fuel_level_percent: 72,
      fuel_type: "Diesel",
      status: "active"
    },
    {
      truck_id: "truck-003",
      plate_number: "QC-T5123",
      code: "TRK-003",
      capacity_liters: 38000,
      fuel_level_percent: 91,
      fuel_type: "Diesel",
      status: "active"
    }
  ],

  recent_deliveries: [
    {
      delivery_id: "delivery-001",
      volume_liters: 25000,
      delivery_date: "2025-10-10",
      status: "completed",
      station_name: "Kingston East",
      truck_code: "TRK-001"
    },
    {
      delivery_id: "delivery-002",
      volume_liters: 30000,
      delivery_date: "2025-10-09",
      status: "completed",
      station_name: "Montreal West",
      truck_code: "TRK-003"
    }
  ],

  data_sources: {
    stations_count: 5,
    deliveries_count: 2,
    trucks_count: 3,
    weather_data: "included",
    ai_analysis: "included"
  },

  ai_analysis: `🚚 OPTIMIZED ROUTE ANALYSIS: TORONTO → MONTREAL

### 🎯 ROUTE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Distance: 542 km
Estimated Duration: 5 hours 30 minutes
Duration with Traffic: 6 hours 15 minutes (peak hours)
Primary Route: Highway 401 East → Highway 20 East
Route Type: AI Optimized - Fastest with fuel efficiency

### 🌤️ WEATHER CONDITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Origin (Toronto): 18°C, Partly Cloudy, Wind 15 km/h NW
Destination (Montreal): 16°C, Clear, Wind 12 km/h W
Impact: Favorable conditions, no weather-related delays expected

### 🚦 TRAFFIC ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Traffic: Light to moderate
Best Departure: 6:00 AM or after 9:00 PM
Expected Delays: 15-30 minutes during peak hours (7-9 AM, 4-6 PM)
Recommended: Early morning departure to avoid Toronto rush hour

### ⛽ FUEL PLANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recommended Stop: Kingston East Petro-Canada
- Location: 178 km from start (ideal mid-point)
- Current Inventory: 42,000L available (84% capacity)
- Fuel Type: Diesel
Estimated Fuel Cost: $180-$220 CAD

### 🚛 RECOMMENDED TRUCKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. TRK-003 (QC-T5123) - 38,000L capacity, 91% fuel
   ✓ Best choice: High fuel level, Quebec-registered
2. TRK-001 (ON-T4567) - 35,000L capacity, 85% fuel
   ✓ Good choice: Ontario-registered, reliable
3. TRK-002 (ON-T4892) - 40,000L capacity, 72% fuel
   ✓ Alternative: Highest capacity

### 📊 OPTIMIZATION FACTORS CONSIDERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Real-time weather data integrated
✓ Fuel station inventory levels checked
✓ Historical delivery patterns analyzed
✓ Traffic patterns and timing optimized
✓ Fuel efficiency maximized

### 💡 KEY RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Depart at 6:00 AM to avoid Toronto traffic
2. Refuel at Kingston East (excellent inventory)
3. Use TRK-003 for optimal fuel efficiency
4. Allow extra 45 minutes for potential delays
5. Monitor weather updates before departure

### 📈 ROUTE CONFIDENCE: 95%
This route has been optimized using AI analysis of multiple data sources
including real-time weather, traffic patterns, and fuel station availability.`
};

// This data structure demonstrates:
// 1. Complete route_summary with all optimization details
// 2. Turn-by-turn directions with proper formatting
// 3. Weather data for both locations
// 4. Traffic condition analysis
// 5. Fuel stations with inventory levels
// 6. Available trucks with specifications
// 7. Full AI analysis text with recommendations
