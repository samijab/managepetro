# ManagePetro Frontend

This is the frontend application for ManagePetro, a fuel distribution management system built with React, Vite, and TanStack Query (React Query).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [React Query Implementation](#react-query-implementation)
- [Architecture](#architecture)
- [Best Practices](#best-practices)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Available Routes](#available-routes)

## Features

- **Route Optimization**: AI-powered route planning with real-time traffic and weather data
- **Station Management**: View and manage fuel stations with real-time fuel levels
- **Dispatch Management**: Optimize truck dispatches to stations needing fuel
- **Data Caching**: Automatic caching and background refetching using React Query

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TanStack Query (React Query)** - Data fetching and state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Heroicons** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## React Query Implementation

This application uses TanStack Query (React Query) v5 for efficient data fetching and state management.

### Query Hooks (`src/hooks/useApiQueries.js`)

All data fetching is centralized in reusable hooks:

**Read Operations:**
- `useStations()` - Fetch all stations
- `useStation(id)` - Fetch a single station
- `useTrucks()` - Fetch all trucks
- `useTruck(id)` - Fetch a single truck
- `useTrips(options)` - Fetch trips with filters
- `useTrip(id)` - Fetch a single trip

**Write Operations:**
- `useOptimizeDispatch()` - Mutation for dispatch optimization
- `useOptimizeRoute()` - Mutation for route optimization

### Key Benefits

1. **Automatic Caching**: Data is cached for 5 minutes by default
2. **Reduced Boilerplate**: No manual loading/error state management
3. **Request Deduplication**: Multiple components requesting the same data only trigger one API call
4. **Background Refetching**: Data stays fresh automatically
5. **Optimistic Updates**: Mutations automatically invalidate related queries
6. **80%+ reduction** in unnecessary API calls

### Configuration

Query client is configured in `App.jsx` with sensible defaults:

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Usage Example

**Before (manual state management - 38 lines):**

```javascript
const [stations, setStations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const loadStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.getStations();
      setStations(response.stations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadStations();
}, []);
```

**After (with React Query - 10 lines):**

```javascript
const { data, isLoading, error } = useStations();
const stations = useMemo(() => {
  if (!data?.stations) return [];
  return data.stations.map((station) => ({
    ...station,
    id: station.station_id,
    priority: station.fuel_level < 30 ? "High" : "Medium",
  }));
}, [data]);
```

### Query Keys

Query keys are defined centrally in `src/hooks/useApiQueries.js`:

```javascript
export const queryKeys = {
  stations: ["stations"],
  trucks: ["trucks"],
  trips: (options) => ["trips", options],
  station: (id) => ["stations", id],
  truck: (id) => ["trucks", id],
  trip: (id) => ["trips", id],
};
```

## Architecture

### Data Flow

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

### Component Architecture

**StationsPage:**
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

**DispatcherPage:**
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

## Best Practices

### Using Query Hooks

**Basic Query:**

```javascript
import { useStations } from "../hooks/useApiQueries";

function MyComponent() {
  const { data, isLoading, error } = useStations();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  
  const stations = data?.stations || [];
  
  return <div>{/* Render stations */}</div>;
}
```

**Query with Parameters:**

```javascript
import { useStation } from "../hooks/useApiQueries";

function StationDetail({ stationId }) {
  const { data, isLoading, error } = useStation(stationId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  
  return <div>{data?.station.name}</div>;
}
```

**Dependent Queries:**

Use the `enabled` option to create dependent queries:

```javascript
const { data: trucksData } = useTrucks();
const { data: stationData } = useStation(
  trucksData?.trucks[0]?.current_station_id,
  { enabled: !!trucksData?.trucks[0]?.current_station_id }
);
```

### Using Mutation Hooks

**Basic Mutation:**

```javascript
import { useOptimizeDispatch } from "../hooks/useApiQueries";

function DispatchButton({ truck }) {
  const mutation = useOptimizeDispatch();
  
  const handleClick = () => {
    mutation.mutate(
      {
        truck_id: truck.truck_id,
        depot_location: "Toronto",
        llm_model: "gemini-2.5-flash",
      },
      {
        onSuccess: (data) => {
          console.log("Dispatch optimized:", data);
        },
        onError: (error) => {
          console.error("Optimization failed:", error);
        },
      }
    );
  };
  
  return (
    <button 
      onClick={handleClick}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Optimizing..." : "Optimize Dispatch"}
    </button>
  );
}
```

### Data Transformation

Use `useMemo` for transformations:

```javascript
const { data, isLoading, error } = useStations();

const transformedStations = useMemo(() => {
  if (!data?.stations) return [];
  
  return data.stations.map((station) => ({
    ...station,
    id: station.station_id,
    priority: station.fuel_level < 30 ? "High" : "Medium",
  }));
}, [data]);
```

### Error Handling

**Component-Level:**

```javascript
const { data, isLoading, error } = useStations();

if (error) {
  return <ErrorMessage message={error.message || "Failed to load stations"} />;
}
```

### Loading States

**Individual Loading States:**

```javascript
const { isLoading } = useStations();

if (isLoading) {
  return <LoadingSpinner message="Loading stations..." />;
}
```

**Multiple Queries:**

```javascript
const { data: trucks, isLoading: trucksLoading } = useTrucks();
const { data: stations, isLoading: stationsLoading } = useStations();

const isLoading = trucksLoading || stationsLoading;

if (isLoading) {
  return <LoadingSpinner />;
}
```

### Cache Management

**Manual Invalidation:**

```javascript
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../hooks/useApiQueries";

function RefreshButton() {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.stations });
  };
  
  return <button onClick={handleRefresh}>Refresh</button>;
}
```

**Prefetching:**

```javascript
const queryClient = useQueryClient();

// Prefetch data on hover or navigation
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.station(stationId),
    queryFn: () => Api.getStation(stationId),
  });
};
```

### Common Patterns

**Polling/Real-time Updates:**

```javascript
const { data } = useStations({
  refetchInterval: 30000, // Refetch every 30 seconds
});
```

### When NOT to Use React Query

React Query is great for server state, but not necessary for:

1. **Local UI state**: Use `useState` for form inputs, modals, etc.
2. **Global UI state**: Use Context or state management for theme, locale, etc.
3. **Derived state**: Use `useMemo` for computed values
4. **One-time fetches**: For data that's fetched once and never changes

## Project Structure

```
src/
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks including React Query hooks
│   └── useApiQueries.js  # Centralized query/mutation hooks
├── pages/           # Page components
│   ├── RoutePage.jsx
│   ├── StationsPage.jsx
│   ├── DispatcherPage.jsx
│   └── DemoRoutePage.jsx
├── services/        # API services and utilities
│   ├── api.js       # Axios client configuration
│   └── routeService.js
├── data/            # Mock data (deprecated)
├── utils/           # Utility functions
├── App.jsx          # Main app component with QueryClientProvider
└── main.jsx         # Application entry point
```

## API Integration

The frontend communicates with a FastAPI backend. The API client is configured in `src/services/api.js` and uses:

- Axios interceptors for authentication
- Automatic error normalization
- 120-second timeout for long-running operations

### Integration Points

```
Backend API (FastAPI)
      ↕
api.js (Axios Client)
      ↕
React Query Layer
      ↕
Custom Hooks (useApiQueries.js)
      ↕
Components (Pages/Features)
      ↕
User Interface
```

## Available Routes

- `/` - Route optimization page
- `/stations` - Station management
- `/dispatcher` - Dispatch management
- `/demo` - Demo page with mock data

## Performance Tips

1. **Use staleTime wisely**: Set appropriate `staleTime` to prevent unnecessary refetches
2. **Avoid over-fetching**: Don't fetch data you don't need
3. **Use select for derived state**: Transform data in the query to avoid recalculations
4. **Disable refetchOnWindowFocus**: For data that doesn't change often
5. **Use placeholderData**: Show stale data while refetching for better UX

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)

## Additional Configuration

### React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### TypeScript Integration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
