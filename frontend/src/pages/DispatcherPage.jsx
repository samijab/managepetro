import { useState, useEffect } from "react";
import Api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import TruckDispatchCard from "../components/TruckDispatchCard";
import StationNeedsCard from "../components/StationNeedsCard";
import DispatchResultCard from "../components/DispatchResultCard";
import { TruckIcon } from "@heroicons/react/24/outline";

function DispatcherPage() {
  const [trucks, setTrucks] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [trucksResponse, stationsResponse] = await Promise.all([
        Api.getTrucks(),
        Api.getStations(),
      ]);

      setTrucks(trucksResponse.trucks || []);
      
      // Filter stations that need refuelling
      const stationsNeedingFuel = (stationsResponse.stations || []).filter(
        (station) => station.needs_refuel || station.fuel_level < 30
      );
      setStations(stationsNeedingFuel);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeDispatch = async (truck) => {
    try {
      setOptimizing(true);
      setError(null);
      setSelectedTruck(truck);
      
      const result = await Api.post("/dispatch/optimize", {
        truck_id: truck.truck_id,
        depot_location: "Toronto",
        llm_model: "gemini-2.5-flash",
      });

      setDispatchResult(result);
    } catch (err) {
      setError(err.message || "Failed to optimize dispatch");
      setDispatchResult(null);
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
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
          <ErrorMessage message={error} />
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
                isOptimizing={optimizing && selectedTruck?.truck_id === truck.truck_id}
                disabled={optimizing}
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
