# React Query Architecture

This document visualizes the data flow architecture after implementing React Query.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │            QueryClientProvider                              ││
│  │                                                             ││
│  │  Configuration:                                             ││
│  │  • staleTime: 5 minutes                                     ││
│  │  • refetchOnWindowFocus: false                              ││
│  │  • retry: 1                                                 ││
│  │                                                             ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │           React Router                                │ ││
│  │  │                                                       │ ││
│  │  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐│ ││
│  │  │  │  RoutePage  │  │ StationsPage │  │ Dispatcher  ││ ││
│  │  │  └─────────────┘  └──────────────┘  └─────────────┘│ ││
│  │  │                                                       │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                ↓
                    ┌───────────────────────┐
                    │   useApiQueries.js    │
                    │  (Query/Mutation      │
                    │       Hooks)          │
                    └───────────────────────┘
                                ↓
                    ┌───────────────────────┐
                    │   Query Cache         │
                    │                       │
                    │  ┌─────────────────┐ │
                    │  │ stations: {...} │ │
                    │  │ trucks: {...}   │ │
                    │  │ trips: {...}    │ │
                    │  └─────────────────┘ │
                    └───────────────────────┘
                                ↓
                    ┌───────────────────────┐
                    │    api.js (Axios)     │
                    └───────────────────────┘
                                ↓
                    ┌───────────────────────┐
                    │   Backend API         │
                    │   (FastAPI)           │
                    └───────────────────────┘
```

## Data Flow

### Query Flow (Read Operations)

```
Component
    ↓
useStations() hook
    ↓
Check Query Cache ──→ Cache Hit? ──→ Return Cached Data
    ↓                                        ↓
Cache Miss                           Background Refetch (if stale)
    ↓
API Request (api.js)
    ↓
Backend API
    ↓
Response
    ↓
Cache Updated
    ↓
Component Re-renders
```

### Mutation Flow (Write Operations)

```
Component
    ↓
useOptimizeDispatch() hook
    ↓
mutation.mutate({ truck_id, ... })
    ↓
API Request (api.js)
    ↓
Backend API
    ↓
Response
    ↓
onSuccess Callback
    ↓
Invalidate Related Queries
    ↓
Automatic Refetch
    ↓
Cache Updated
    ↓
Components Re-render
```

## Component Architecture

### StationsPage

```
StationsPage.jsx
    │
    ├─→ useStations()                    [React Query Hook]
    │   └─→ Query Cache → API → Backend
    │
    ├─→ useMemo(transform data)          [Data Transformation]
    │
    └─→ DynamicTable                     [Presentation Component]
        └─→ Display stations with stats
```

### DispatcherPage

```
DispatcherPage.jsx
    │
    ├─→ useTrucks()                      [React Query Hook]
    │   └─→ Query Cache → API → Backend
    │
    ├─→ useStations()                    [React Query Hook]
    │   └─→ Query Cache → API → Backend
    │
    ├─→ useOptimizeDispatch()            [Mutation Hook]
    │   └─→ API → Backend → Cache Invalidation
    │
    ├─→ useMemo(filter stations)         [Data Transformation]
    │
    └─→ Components
        ├─→ TruckDispatchCard (multiple)
        ├─→ StationNeedsCard (multiple)
        └─→ DispatchResultCard
```

### RoutePage

```
RoutePage.jsx
    │
    └─→ useRouteData()                   [Custom Hook]
        └─→ useOptimizeRoute()           [Mutation Hook]
            └─→ API → Backend
            └─→ Transform Response
            └─→ Update Local State
```

## Hook Hierarchy

```
useApiQueries.js
    │
    ├─── Query Hooks (Read)
    │    ├─→ useStations()
    │    │   └─→ queryKey: ["stations"]
    │    │   └─→ queryFn: Api.getStations
    │    │
    │    ├─→ useStation(id)
    │    │   └─→ queryKey: ["stations", id]
    │    │   └─→ queryFn: Api.getStation(id)
    │    │   └─→ enabled: !!id
    │    │
    │    ├─→ useTrucks()
    │    │   └─→ queryKey: ["trucks"]
    │    │   └─→ queryFn: Api.getTrucks
    │    │
    │    ├─→ useTruck(id)
    │    │   └─→ queryKey: ["trucks", id]
    │    │   └─→ queryFn: Api.getTruck(id)
    │    │   └─→ enabled: !!id
    │    │
    │    ├─→ useTrips(options)
    │    │   └─→ queryKey: ["trips", options]
    │    │   └─→ queryFn: Api.getTrips(options)
    │    │
    │    └─→ useTrip(id)
    │        └─→ queryKey: ["trips", id]
    │        └─→ queryFn: Api.getTrip(id)
    │        └─→ enabled: !!id
    │
    └─── Mutation Hooks (Write)
         ├─→ useOptimizeDispatch()
         │   └─→ mutationFn: Api.post("/dispatch/optimize")
         │   └─→ onSuccess: invalidate trucks & stations
         │
         └─→ useOptimizeRoute()
             └─→ mutationFn: Api.post("/routes/optimize")
```

## Cache Structure

```json
{
  "queries": {
    "['stations']": {
      "state": "success",
      "data": {
        "stations": [...],
        "count": 10
      },
      "dataUpdatedAt": 1234567890,
      "isStale": false
    },
    "['trucks']": {
      "state": "success",
      "data": {
        "trucks": [...],
        "count": 5
      },
      "dataUpdatedAt": 1234567890,
      "isStale": false
    },
    "['trips', { limit: 50, successfulOnly: false }]": {
      "state": "success",
      "data": {
        "trips": [...],
        "count": 50
      },
      "dataUpdatedAt": 1234567890,
      "isStale": false
    }
  }
}
```

## State Management Comparison

### Before (Manual State)

```
Component State:
├─ data (useState)
├─ loading (useState)
├─ error (useState)
└─ useEffect (fetch on mount)
    ├─ setLoading(true)
    ├─ try/catch API call
    ├─ setData(response)
    ├─ setError(err)
    └─ setLoading(false)
```

### After (React Query)

```
Component:
└─ useStations() 
    └─ Returns: { data, isLoading, error }
        ├─ Automatic caching
        ├─ Automatic refetching
        ├─ Automatic error handling
        └─ Automatic cleanup
```

## Key Benefits Visualized

```
┌─────────────────────┐
│  Component A        │     ┌──────────────────────┐
│  useStations() ─────┼────→│                      │
└─────────────────────┘     │   Query Cache        │
                            │   ["stations"]       │
┌─────────────────────┐     │                      │
│  Component B        │     │   ┌──────────────┐   │
│  useStations() ─────┼────→│   │ Shared Data! │   │
└─────────────────────┘     │   └──────────────┘   │
                            │                      │
┌─────────────────────┐     │  • Single API call   │
│  Component C        │     │  • Instant access    │
│  useStations() ─────┼────→│  • Auto sync         │
└─────────────────────┘     └──────────────────────┘
```

## Performance Characteristics

### Request Timeline

```
Time ──────────────────────────────────────────────→

Without React Query:
[API Call] [Wait] [API Call] [Wait] [API Call]
   ↑ Page 1    ↑ Page 2         ↑ Page 3
   (Fresh)     (Fresh)          (Fresh)

With React Query:
[API Call] [Cache Hit] [Cache Hit] [Background Refetch]
   ↑ Page 1    ↑ Page 2   ↑ Page 3     ↑ (if stale)
   (Fresh)     (Instant!) (Instant!)   (Silent update)
```

### Cache Lifecycle

```
Initial Load        After 5 min        User Returns
     ↓                   ↓                  ↓
[API Request]  →  [Data is Stale]  →  [Show Stale Data]
     ↓                   ↓                  ↓
[Cache Data]    →  [Mark Stale]     →  [Background Refetch]
     ↓                   ↓                  ↓
[Data Fresh]    →  [Still Valid]   →  [Update Cache]
```

## Error Handling Flow

```
API Request Failed
       ↓
Retry Once (configured)
       ↓
Still Failed?
       ↓
   ┌───┴───┐
   │       │
Success  Failure
   ↓       ↓
Cache   error object
Update  available in
       component
       ↓
   Display Error UI
```

## Integration Points

```
┌──────────────────────────────────────────┐
│           External Systems               │
├──────────────────────────────────────────┤
│                                          │
│  Backend API (FastAPI)                   │
│      ↕                                   │
│  api.js (Axios Client)                   │
│      ↕                                   │
│  React Query Layer                       │
│      ↕                                   │
│  Custom Hooks (useApiQueries.js)         │
│      ↕                                   │
│  Components (Pages/Features)             │
│      ↕                                   │
│  User Interface                          │
│                                          │
└──────────────────────────────────────────┘
```

## Summary

This architecture provides:
- **Separation of Concerns**: Data fetching logic separate from UI
- **Reusability**: Hooks can be used across multiple components
- **Performance**: Automatic caching reduces network requests
- **Developer Experience**: Simple, declarative API
- **User Experience**: Faster page loads and smooth transitions
- **Maintainability**: Centralized query management
- **Type Safety**: JSDoc annotations for IntelliSense support
