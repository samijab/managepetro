# Dispatcher Feature - UI Overview

## Screenshots and Visual Guide

### 1. Dispatcher Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  🚛 Dispatcher Dashboard                                           │
│  Optimize truck dispatches to stations requiring fuel delivery     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Available    │  │ Stations Needing │  │ IoT Auto-        │   │
│  │ Trucks       │  │ Fuel             │  │ Requests         │   │
│  │      5       │  │       8          │  │       5          │   │
│  └──────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                     │
├─────────────────────────────┬───────────────────────────────────┤
│  Available Trucks (8)       │  Stations Requiring Fuel (8)      │
│                             │                                     │
│  ┌─────────────────────┐   │  ┌─────────────────────────────┐  │
│  │ 🚛 T01              │   │  │ 📍 FuelLogic Toronto        │  │
│  │ AB-1421      active │   │  │ Toronto, ON    🔵 IoT Auto │  │
│  │                     │   │  │                              │  │
│  │ Fuel Level: ████ 85%│   │  │ Fuel Level: █░░░ 20%        │  │
│  │                     │   │  │                              │  │
│  │ Compartments (2):   │   │  │ Fuel Type: diesel           │  │
│  │ • Comp 1: diesel    │   │  │ Current: 25,000 L           │  │
│  │   14,000/16,000 L   │   │  │ Capacity: 120,000 L         │  │
│  │ • Comp 2: diesel    │   │  │ Needed: 95,000 L            │  │
│  │   15,000/16,000 L   │   │  └─────────────────────────────┘  │
│  │                     │   │                                     │
│  │ [Optimize Dispatch] │   │  ┌─────────────────────────────┐  │
│  └─────────────────────┘   │  │ 📍 FuelLogic Vancouver      │  │
│                             │  │ Vancouver, BC  🔵 IoT Auto  │  │
│  ┌─────────────────────┐   │  │                              │  │
│  │ 🚛 T02              │   │  │ Fuel Level: ██░░ 19%        │  │
│  │ BC-4422      active │   │  │                              │  │
│  │                     │   │  │ Fuel Type: gasoline         │  │
│  │ Fuel Level: ████ 83%│   │  │ Current: 18,000 L           │  │
│  │                     │   │  │ Capacity: 95,000 L          │  │
│  │ Compartments (2):   │   │  │ Needed: 77,000 L            │  │
│  │ • Comp 1: gasoline  │   │  └─────────────────────────────┘  │
│  │   13,000/15,000 L   │   │                                     │
│  │ • Comp 2: gasoline  │   │  ┌─────────────────────────────┐  │
│  │   12,000/15,000 L   │   │  │ 📍 FuelLogic Winnipeg       │  │
│  │                     │   │  │ Winnipeg, MB   🔵 IoT Auto  │  │
│  │ [Optimize Dispatch] │   │  │                              │  │
│  └─────────────────────┘   │  │ Fuel Level: ██░░ 23%        │  │
│                             │  │ ...                          │  │
└─────────────────────────────┴───────────────────────────────────┘
```

### 2. Optimization Result Modal

```
┌────────────────────────────────────────────────────────────────────┐
│ 🚛 Dispatch Optimization Result                          [X]       │
│    T01 - AB-1421                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Dispatch Summary                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Stations     │  │ Total        │  │ Estimated    │            │
│  │ to Visit     │  │ Distance     │  │ Duration     │            │
│  │      3       │  │   245 km     │  │  4h 30m      │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  ┌──────────────┐                                                  │
│  │ Total Fuel   │                                                  │
│  │ Delivery     │   Departure: 06:00 AM                            │
│  │  85,000 L    │   Return to Depot: 10:30 AM                      │
│  └──────────────┘                                                  │
│                                                                     │
│  🗺️ Optimized Route (3 stops)                                     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ ① FuelLogic Toronto - Toronto                               │  │
│  │    Distance: 15 km                                           │  │
│  │    Fuel to Deliver: 30,000 L (diesel)                        │  │
│  │    ETA: 06:20 AM                                             │  │
│  │    Reason: Critical - 20% fuel level                         │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ ② FuelLogic Ottawa - Ottawa                                 │  │
│  │    Distance: 450 km                                          │  │
│  │    Fuel to Deliver: 28,000 L (diesel)                        │  │
│  │    ETA: 09:45 AM                                             │  │
│  │    Reason: Low fuel - 22% level, en route                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ ③ FuelLogic Winnipeg - Winnipeg                             │  │
│  │    Distance: 210 km                                          │  │
│  │    Fuel to Deliver: 27,000 L (diesel)                        │  │
│  │    ETA: 01:15 PM                                             │  │
│  │    Reason: IoT auto-request, moderate priority               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Truck Compartments                                                 │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Compartment 1          diesel          14,000 L available  │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Compartment 2          diesel          15,000 L available  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  AI Analysis                                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ # DISPATCH OPTIMIZATION                                     │   │
│  │                                                             │   │
│  │ ## ROUTE RATIONALE                                          │   │
│  │ The optimized route prioritizes FuelLogic Toronto due to... │   │
│  │ [Full AI analysis with reasoning]                           │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
├────────────────────────────────────────────────────────────────────┤
│                          [Close]                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Color Coding

### Fuel Levels
- **Red** (< 25%): Critical - Urgent refuelling needed
- **Yellow** (25-49%): Low - Should be refuelled soon  
- **Green** (≥ 50%): Adequate - Normal operations

### Truck Status
- **Green Badge** (active): Available for dispatch
- **Yellow Badge** (maintenance): Under maintenance
- **Red Badge** (offline): Not available

### Request Methods
- **Blue Badge with Signal Icon** (IoT): Automated request from IoT devices
- **Gray Badge** (Manual): Manual request from station staff

## Component Features

### TruckDispatchCard
- Shows truck code and plate number
- Visual fuel level indicator
- Detailed compartment breakdown
- Status badge (active/maintenance/offline)
- Disabled when truck is not active or during optimization
- Loading spinner during optimization

### StationNeedsCard
- Station name and location
- Request method badge (IoT/Manual)
- Visual fuel level with percentage
- Current level and capacity
- Calculated fuel needed
- Hover effect for interactivity

### DispatchResultCard
- Full-screen modal overlay
- Scrollable content for long routes
- Statistics grid with color-coded metrics
- Numbered route stops with details
- Compartment allocation view
- Complete AI analysis in expandable section
- Close button to return to dashboard

## Responsive Design

The dispatcher dashboard is fully responsive:

- **Desktop** (≥1024px): Side-by-side two-column layout
- **Tablet** (768-1023px): Stacked layout with full-width cards
- **Mobile** (< 768px): Single column with compact cards

All components maintain usability across all screen sizes.
