# React Query Best Practices

This document outlines best practices for using React Query in the ManagePetro frontend.

## Query Keys

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

### Best Practices for Query Keys

1. **Use consistent structure**: Always use arrays for query keys
2. **Include parameters**: For queries with parameters, include them in the key
3. **Hierarchical keys**: Use nested arrays for related data (e.g., `["stations", id]`)
4. **Export centrally**: Keep all query keys in one place for easy maintenance

## Using Query Hooks

### Basic Query

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

### Query with Parameters

```javascript
import { useStation } from "../hooks/useApiQueries";

function StationDetail({ stationId }) {
  const { data, isLoading, error } = useStation(stationId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  
  return <div>{data?.station.name}</div>;
}
```

### Dependent Queries

Use the `enabled` option to create dependent queries:

```javascript
const { data: trucksData } = useTrucks();
const { data: stationData } = useStation(
  trucksData?.trucks[0]?.current_station_id,
  { enabled: !!trucksData?.trucks[0]?.current_station_id }
);
```

## Using Mutation Hooks

### Basic Mutation

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

### Mutation with Manual Cache Updates

```javascript
export function useOptimizeDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => Api.post("/dispatch/optimize", params),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.trucks });
      queryClient.invalidateQueries({ queryKey: queryKeys.stations });
    },
  });
}
```

## Data Transformation

### Use useMemo for Transformations

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

### Keep Transformations Simple

Prefer simple transformations in components over complex data processing. For heavy transformations, consider:
1. Doing them on the backend
2. Using a `select` option in the query
3. Creating a custom hook wrapper

## Error Handling

### Component-Level Error Handling

```javascript
const { data, isLoading, error } = useStations();

if (error) {
  return <ErrorMessage message={error.message || "Failed to load stations"} />;
}
```

### Global Error Handling

Configure global error handling in the QueryClient:

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        // Log to error tracking service
        console.error("Query error:", error);
      },
    },
    mutations: {
      onError: (error) => {
        // Show toast notification
        console.error("Mutation error:", error);
      },
    },
  },
});
```

## Loading States

### Individual Loading States

```javascript
const { isLoading } = useStations();

if (isLoading) {
  return <LoadingSpinner message="Loading stations..." />;
}
```

### Multiple Queries

```javascript
const { data: trucks, isLoading: trucksLoading } = useTrucks();
const { data: stations, isLoading: stationsLoading } = useStations();

const isLoading = trucksLoading || stationsLoading;

if (isLoading) {
  return <LoadingSpinner />;
}
```

### Background Refetching

React Query shows `isLoading` only on the first fetch. Use `isFetching` to show background updates:

```javascript
const { data, isLoading, isFetching } = useStations();

return (
  <div>
    {isFetching && <RefreshIndicator />}
    {/* Your content */}
  </div>
);
```

## Cache Management

### Manual Invalidation

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

### Manual Cache Updates

```javascript
const queryClient = useQueryClient();

// Update cache directly
queryClient.setQueryData(queryKeys.stations, (oldData) => ({
  ...oldData,
  stations: [...oldData.stations, newStation],
}));
```

### Prefetching

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

## Common Patterns

### List and Detail Pattern

```javascript
// List view - fetch all stations
const { data: stationsData } = useStations();

// Detail view - fetch single station
const { data: stationData } = useStation(selectedStationId);
```

The cache is automatically shared, so switching between views is instant.

### Polling/Real-time Updates

```javascript
const { data } = useStations({
  refetchInterval: 30000, // Refetch every 30 seconds
});
```

### Optimistic Updates

```javascript
const mutation = useMutation({
  mutationFn: updateStation,
  onMutate: async (newStation) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.stations });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKeys.stations);
    
    // Optimistically update
    queryClient.setQueryData(queryKeys.stations, (old) => ({
      ...old,
      stations: old.stations.map((s) => 
        s.station_id === newStation.station_id ? newStation : s
      ),
    }));
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKeys.stations, context.previous);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: queryKeys.stations });
  },
});
```

## Performance Tips

1. **Use staleTime wisely**: Set appropriate `staleTime` to prevent unnecessary refetches
2. **Avoid over-fetching**: Don't fetch data you don't need
3. **Use select for derived state**: Transform data in the query to avoid recalculations
4. **Disable refetchOnWindowFocus**: For data that doesn't change often
5. **Use placeholderData**: Show stale data while refetching for better UX

## When NOT to Use React Query

React Query is great for server state, but not necessary for:

1. **Local UI state**: Use `useState` for form inputs, modals, etc.
2. **Global UI state**: Use Context or state management for theme, locale, etc.
3. **Derived state**: Use `useMemo` for computed values
4. **One-time fetches**: For data that's fetched once and never changes

## Debugging

### React Query DevTools

Add DevTools in development (optional):

```javascript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Logging

Enable query logging:

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onSuccess: (data, query) => {
        console.log("Query success:", query.queryKey, data);
      },
    },
  },
});
```

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
