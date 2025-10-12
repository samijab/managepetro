# ManagePetro Frontend

This is the frontend application for ManagePetro, a fuel distribution management system built with React, Vite, and TanStack Query (React Query).

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

This application uses TanStack Query (React Query) for efficient data fetching and state management:

### Query Hooks (`src/hooks/useApiQueries.js`)

All data fetching is centralized in reusable hooks:

- `useStations()` - Fetch all stations
- `useStation(id)` - Fetch a single station
- `useTrucks()` - Fetch all trucks
- `useTruck(id)` - Fetch a single truck
- `useTrips(options)` - Fetch trips with filters
- `useTrip(id)` - Fetch a single trip
- `useOptimizeDispatch()` - Mutation for dispatch optimization
- `useOptimizeRoute()` - Mutation for route optimization

### Benefits

1. **Automatic Caching**: Data is cached for 5 minutes by default
2. **Reduced Boilerplate**: No manual loading/error state management
3. **Request Deduplication**: Multiple components requesting the same data only trigger one API call
4. **Background Refetching**: Data stays fresh automatically
5. **Optimistic Updates**: Mutations automatically invalidate related queries

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

Before (manual state management):

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

After (with React Query):

```javascript
const { data, isLoading, error } = useStations();
const stations = data?.stations || [];
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks including React Query hooks
├── pages/           # Page components
├── services/        # API services and utilities
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

## Available Routes

- `/` - Route optimization page
- `/stations` - Station management
- `/dispatcher` - Dispatch management
- `/demo` - Demo page with mock data

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
