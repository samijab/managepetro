import { useState, useMemo } from "react";
import { useTrucks, useStations, useOptimizeDispatch } from "../hooks/useApiQueries";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import TruckDispatchCard from "../components/TruckDispatchCard";
import StationNeedsCard from "../components/StationNeedsCard";
import DispatchResultCard from "../components/DispatchResultCard";
import { TruckIcon, MapPinIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Api from "../services/api";
import { DEFAULT_DEPOT_LOCATION, DEFAULT_LLM_MODEL, LLM_MODELS, FUEL_THRESHOLDS, TRUCK_STATUS, REQUEST_METHODS } from "../constants/config";

function DispatcherPage() {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [depotLocation, setDepotLocation] = useState(DEFAULT_DEPOT_LOCATION);
  const [llmModel, setLlmModel] = useState(DEFAULT_LLM_MODEL);

  // Fetch data using React Query
  const { data: trucksData, isLoading: trucksLoading, error: trucksError } = useTrucks();
  const { data: stationsData, isLoading: stationsLoading, error: stationsError } = useStations();
  const optimizeDispatchMutation = useOptimizeDispatch();

  const trucks = trucksData?.trucks || [];
  const stations = useMemo(() => {
    if (!stationsData?.stations) return [];
    // Filter stations that need refuelling based on defined threshold
    return stationsData.stations.filter(
      (station) => station.needs_refuel || station.fuel_level < FUEL_THRESHOLDS.HIGH
    );
  }, [stationsData]);

  const isLoading = trucksLoading || stationsLoading;
  const error = trucksError || stationsError;

  const handleOptimizeDispatch = async (truck) => {
    setSelectedTruck(truck);
    
    optimizeDispatchMutation.mutate(
      {
        truck_id: truck.truck_id,
        depot_location: depotLocation,
        llm_model: llmModel,
      },
      {
        onSuccess: (result) => {
          // Transform the API response for consistent frontend consumption
          const transformedResult = Api.transformDispatchResponse(result);
          setDispatchResult(transformedResult);
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
        <div className="flex items-center justify-between">
          <div>
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
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Dispatch Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="depotLocation"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Depot Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="depotLocation"
                    value={depotLocation}
                    onChange={(e) => setDepotLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter depot location"
                  />
                  <MapPinIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="llmModel"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  AI Model
                </label>
                <select
                  id="llmModel"
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {LLM_MODELS.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
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
            {trucks.filter((t) => t.status === TRUCK_STATUS.ACTIVE).length}
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
            {stations.filter((s) => s.request_method === REQUEST_METHODS.IOT).length}
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
