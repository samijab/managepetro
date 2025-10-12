# Trip Efficiency Optimization Variables

This document describes the efficiency variables and optimization strategies implemented in the ManagePetro route and dispatch optimization system.

## Purpose

The primary goal of the ManagePetro application is to **minimize overhead costs** of running a trucking company by making truck trips as efficient as possible. This is achieved by considering multiple variables that affect trip efficiency and optimizing routes to maximize value while minimizing waste.

## Key Efficiency Variables

### 1. Geographic Clustering

**Purpose**: Avoid wasted trips by servicing multiple nearby stations in a single trip.

**Implementation**:
- Automatically detects stations within 20-50 km of each other
- Groups nearby stations for multi-stop routes
- Uses Haversine formula for accurate distance calculations
- Prioritizes circular routes that efficiently return to depot

**Benefits**:
- Reduces total kilometers traveled
- Maximizes deliveries per trip
- Minimizes fuel consumption per delivery
- Reduces driver hours per delivery

**Example**: Instead of making separate trips to Toronto (200 km) and nearby Mississauga (220 km), combine them into one trip (210 km total).

### 2. Fuel Consumption Tracking

**Purpose**: Accurately calculate operational costs and optimize for fuel efficiency.

**Implementation**:
- Default consumption rate: 35 L/100km for heavy trucks
- Truck fuel tank: 800L (operational fuel)
- Cargo capacity: 20,000-40,000L (fuel to deliver)
- Realistic range calculation: ~1,800 km on full tank

**Variables Affecting Consumption**:
- Load weight (heavier loads = higher consumption)
- Terrain (hills increase consumption by 10-20%)
- Weather (rain/snow increases consumption by 15-30%)
- Speed (highway vs. city driving)
- Traffic (stop-and-go increases consumption)

**Efficiency Rating System**:
- Excellent: < 30 L/100km
- Good: 30-35 L/100km
- Average: 35-40 L/100km
- Poor: > 40 L/100km

### 3. Priority-Based Routing

**Purpose**: Balance urgency with efficiency to avoid emergency situations.

**Priority Levels** (based on fuel level percentage):
- **Critical** (< 10%): Immediate attention required, highest priority
- **High** (10-30%): Urgent delivery needed within 24 hours
- **Medium** (30-50%): Routine delivery, can be scheduled efficiently
- **Low** (> 50%): No immediate need, opportunistic delivery

**Optimization Strategy**:
- Critical stations always take priority
- High-priority stations grouped with nearby medium-priority stations
- Medium/low priority stations used to fill out efficient routes
- Emergency deliveries combined with nearby routine deliveries when possible

### 4. Compartment Utilization

**Purpose**: Maximize cargo capacity to reduce number of trips required.

**Implementation**:
- Track utilization percentage per compartment (e.g., "75% utilized")
- Match compartment capacity to station needs
- Prioritize stations that can utilize full compartment loads
- Mix stations with complementary fuel needs

**Example**: If compartment 1 has 15,000L of diesel, prioritize stations needing 12,000-15,000L over those needing only 2,000L.

### 5. Time-Based Optimization

**Purpose**: Reduce travel time and fuel consumption through optimal timing.

**Traffic Avoidance**:
- Recommend early morning departures (6-7 AM)
- Avoid peak rush hours (7:30-9:30 AM, 4:30-6:30 PM)
- Consider real-time traffic conditions
- Plan around known construction zones

**Driver Regulations**:
- Maximum 13 hours driving per day
- Mandatory rest breaks
- Optimal shift scheduling
- Consider driver availability

**Cost Impact**: Avoiding rush hour can save 20-30% travel time and 15-20% fuel.

### 6. Multi-Stop Route Optimization

**Purpose**: Apply traveling salesman problem (TSP) logic to minimize total distance.

**Strategy**:
- Identify all stations needing delivery
- Group by geographic clusters (within 50 km)
- Sequence stops to minimize backtracking
- Create circular routes when possible
- Target 3-5 stations per trip for optimal efficiency

**Algorithm Considerations**:
- Start from depot location
- Visit critical priority stations first
- Sequence remaining stops by proximity
- Return to depot via efficient route

**Example Route**:
```
Depot → Critical Station A (80km) → 
Nearby High Priority B (+15km) → 
Nearby Medium Priority C (+12km) → 
Return to Depot (70km)
Total: 177km for 3 deliveries = 59km per delivery
```

vs. separate trips:
```
Depot → Station A → Depot (160km)
Depot → Station B → Depot (140km)  
Depot → Station C → Depot (130km)
Total: 430km for 3 deliveries = 143km per delivery
```

**Efficiency Gain**: 59% reduction in travel distance!

### 7. Weather Impact Analysis

**Purpose**: Account for weather effects on fuel consumption and safety.

**Consumption Impact**:
- Clear conditions: Baseline consumption
- Rain: +15-20% consumption
- Snow: +20-30% consumption
- Ice: +25-35% consumption + safety concerns
- Strong winds: +10-15% consumption

**Safety Considerations**:
- Recommend delays during severe weather
- Suggest alternative routes
- Account for reduced visibility
- Consider road condition reports

### 8. Load Optimization

**Purpose**: Ensure trucks are efficiently loaded to minimize trips.

**Strategy**:
- Avoid partial loads when possible
- Match truck capacity to total delivery needs
- Consider multiple fuel types in compartments
- Balance weight distribution

**Example**: If total deliveries need 35,000L and truck capacity is 40,000L, prefer one trip at 87.5% capacity over two trips at 43.75% each.

### 9. Historical Performance Analysis

**Purpose**: Learn from past deliveries to improve future routing.

**Data Considered**:
- Previous route efficiency scores
- Actual vs. estimated travel times
- Success rates per route
- Traffic pattern history
- Seasonal variations

**Application**:
- Favor historically efficient routes
- Avoid routes with known issues
- Adjust estimates based on historical data
- Identify optimal timing patterns

### 10. Cost-Benefit Analysis

**Purpose**: Ensure every trip provides positive return on investment.

**Variables**:
- Fuel cost per kilometer
- Driver cost per hour
- Vehicle maintenance per kilometer
- Revenue per liter delivered
- Opportunity cost of alternative routes

**Decision Framework**:
- Calculate cost per delivery
- Compare against revenue per delivery
- Prioritize high-value efficient routes
- Defer low-value distant deliveries
- Combine low-value deliveries with high-value ones

## Output Metrics

### Trip Efficiency Score

A composite score (0-10) that evaluates overall route efficiency:

**Factors**:
- Stations per 100 km (higher = better)
- Fuel consumption vs. fuel delivered ratio
- Compartment utilization percentage
- Priority coverage (critical stations served)
- Time efficiency (hours vs. deliveries)

**Rating Scale**:
- 9-10: Exceptional efficiency
- 7-8: Good efficiency
- 5-6: Adequate efficiency
- 3-4: Poor efficiency
- 0-2: Very inefficient, needs optimization

### Key Performance Indicators

1. **Stations per Trip**: Target 3-5 stations per trip
2. **Distance Efficiency**: < 100 km per station on average
3. **Compartment Utilization**: > 70% average utilization
4. **Priority Coverage**: All critical stations serviced within 6 hours
5. **Fuel Efficiency**: Actual vs. estimated consumption within 10%

## Best Practices

### For Dispatchers

1. **Always check for nearby stations** before dispatching to a single location
2. **Prioritize critical stations** but look for nearby deliveries to combine
3. **Avoid rush hour departures** when possible
4. **Consider weather forecasts** for next-day planning
5. **Review efficiency scores** to identify optimization opportunities

### For Route Planning

1. **Group stations within 50 km** into single trips
2. **Create circular routes** to minimize backtracking
3. **Match compartment capacity** to station needs
4. **Consider traffic patterns** in timing recommendations
5. **Balance urgency with efficiency** in priority routing

### For Fleet Management

1. **Track fuel consumption rates** per truck
2. **Monitor efficiency ratings** and identify underperforming vehicles
3. **Schedule maintenance** to avoid impacting critical deliveries
4. **Optimize truck assignments** based on cargo needs
5. **Analyze historical data** to improve future planning

## Example Optimization Scenario

### Before Optimization

**Request**: Deliver fuel to Station Alpha (Toronto, 40,000L needed, Critical priority)

**Simple Approach**:
- Depot → Station Alpha → Depot
- Distance: 280 km round trip
- Time: 4 hours
- Stations served: 1
- Efficiency: 280 km per station

### After Optimization

**AI Analysis**: Identifies two nearby stations also needing fuel:
- Station Beta (Mississauga, 25 km from Alpha, High priority)
- Station Gamma (Brampton, 18 km from Beta, Medium priority)

**Optimized Route**:
- Depot → Station Alpha (Critical) → Station Beta (+25 km) → Station Gamma (+18 km) → Depot
- Distance: 323 km round trip
- Time: 5.5 hours
- Stations served: 3
- Efficiency: 107 km per station

**Results**:
- **Distance savings**: 317 km saved (vs. three separate trips of 640 km total)
- **Time savings**: 6.5 hours saved
- **Fuel savings**: ~111 L saved (at 35 L/100km)
- **Cost savings**: ~60% reduction in operational costs
- **Efficiency gain**: 62% improvement (280 → 107 km per station)

## Implementation in Code

### Data Models

**TruckData** (`backend/models/data_models.py`):
- `fuel_consumption_rate`: L/100km
- `truck_fuel_tank_liters`: Operational fuel capacity
- `max_range_km`: Calculated driving range
- `efficiency_rating`: Performance classification
- `cargo_fuel_liters`: Fuel available for delivery

**StationData** (`backend/models/data_models.py`):
- `fuel_level_percent`: Current fuel percentage
- `priority_level`: Critical/High/Medium/Low
- `distance_to()`: Calculate distance to other stations
- `needs_refuel`: Boolean flag for low fuel

### Prompts

**Dispatch Optimization** (`backend/prompts/dispatch_optimization.md`):
- Includes all 10 efficiency variables
- Emphasizes multi-stop optimization
- Requires efficiency rationale in output

**Route Optimization** (`backend/prompts/comprehensive_route_optimization.md`):
- Trip efficiency optimization section
- Multi-stop opportunity identification
- Fuel consumption and efficiency scoring

### Services

**PromptService** (`backend/services/prompt_service.py`):
- Formats truck efficiency data
- Shows nearby stations within 50 km
- Includes compartment utilization
- Provides priority levels

## Future Enhancements

### Planned Improvements

1. **Real-time Traffic Integration**: Use live traffic APIs for dynamic routing
2. **Machine Learning**: Predict optimal routes based on historical patterns
3. **Driver Preferences**: Consider driver familiarity with routes
4. **Customer Scheduling**: Coordinate with station preferred delivery times
5. **Dynamic Pricing**: Adjust priorities based on delivery pricing
6. **Fuel Price Optimization**: Consider fuel cost variations by location
7. **Vehicle Telematics**: Real-time fuel consumption tracking
8. **Predictive Maintenance**: Anticipate vehicle issues before they impact routes

### Metrics Dashboard

Future dashboard to track:
- Average efficiency score per truck
- Cost savings from multi-stop optimization
- Fuel consumption trends
- Priority response times
- Route performance comparisons

## Conclusion

By considering these 10 efficiency variables and implementing intelligent optimization strategies, ManagePetro achieves significant cost savings and operational improvements. The key insight is that **multi-stop routes combined with priority-based scheduling** can reduce operational costs by 50-60% compared to naive single-destination dispatching.

The system balances multiple competing objectives:
- **Urgency**: Critical stations get immediate attention
- **Efficiency**: Nearby stations are grouped into single trips
- **Economics**: Routes are optimized for cost-effectiveness
- **Safety**: Weather and road conditions are considered
- **Compliance**: Driver regulations and vehicle constraints are respected

This holistic approach to trip efficiency optimization directly addresses the problem statement: **minimize overhead costs by making truck trips as efficient as possible**.
