import { useState, useMemo } from "react";
import { useTrucks, useStations, useOptimizeDispatch } from "../hooks/useApiQueries";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import TruckDispatchCard from "../components/TruckDispatchCard";
import StationNeedsCard from "../components/StationNeedsCard";
import DispatchResultCard from "../components/DispatchResultCard";
import { TruckIcon } from "@heroicons/react/24/outline";

function DispatcherPage() {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [dispatchResult, setDispatchResult] = useState(null);

  // Fetch data using React Query
  const { data: trucksData, isLoading: trucksLoading, error: trucksError } = useTrucks();
  const { data: stationsData, isLoading: stationsLoading, error: stationsError } = useStations();
  const optimizeDispatchMutation = useOptimizeDispatch();

  const trucks = trucksData?.trucks || [];
  const stations = useMemo(() => {
    if (!stationsData?.stations) return [];
    // Filter stations that need refuelling
    return stationsData.stations.filter(
      (station) => station.needs_refuel || station.fuel_level < 30
    );
  }, [stationsData]);

  const isLoading = trucksLoading || stationsLoading;
  const error = trucksError || stationsError;

  const handleOptimizeDispatch = async (truck) => {
    setSelectedTruck(truck);
    
    optimizeDispatchMutation.mutate(
      {
        truck_id: truck.truck_id,
        depot_location: "Toronto",
        llm_model: "gemini-2.5-flash",
      },
      {
        onSuccess: (result) => {
          setDispatchResult(result);
        },
        onError: () => {
          setDispatchResult(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Loading dispatcher data..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <TruckIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Dispatcher Dashboard
          </h1>
        </div>
        <p className="text-gray-600">
          Optimize truck dispatches to stations requiring fuel delivery
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error.message || "Failed to load data"} />
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Available Trucks</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {trucks.filter((t) => t.status === "active").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Stations Needing Fuel</div>
          <div className="mt-1 text-3xl font-semibold text-orange-600">
            {stations.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">IoT Auto-Requests</div>
          <div className="mt-1 text-3xl font-semibold text-blue-600">
            {stations.filter((s) => s.request_method === "IoT").length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Trucks */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available Trucks ({trucks.length})
          </h2>
          <div className="space-y-4">
            {trucks.map((truck) => (
              <TruckDispatchCard
                key={truck.truck_id}
                truck={truck}
                onOptimize={handleOptimizeDispatch}
                isOptimizing={optimizeDispatchMutation.isPending && selectedTruck?.truck_id === truck.truck_id}
                disabled={optimizeDispatchMutation.isPending}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Stations or Dispatch Result */}
        <div>
          {dispatchResult ? (
            <DispatchResultCard
              result={dispatchResult}
              onClose={() => {
                setDispatchResult(null);
                setSelectedTruck(null);
              }}
            />
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Stations Requiring Fuel ({stations.length})
              </h2>
              <div className="space-y-4">
                {stations.map((station) => (
                  <StationNeedsCard key={station.station_id} station={station} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DispatcherPage;
