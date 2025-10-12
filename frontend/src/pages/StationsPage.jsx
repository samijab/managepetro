import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import StatCard from "../components/StatCard";
import { mockStations } from "../data/mockData";
import {
  getFuelLevelColor,
  getPriorityColor,
  filterStationsByFuelLevel,
  filterStationsByPriority,
  FUEL_THRESHOLDS,
} from "../utils/fuelUtils";

function StationsPage() {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Column configuration for the stations table
  const columns = [
    {
      key: "name",
      label: "Station Name",
      sortable: true,
    },
    {
      key: "fuel_type",
      label: "Fuel Type",
      sortable: true,
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "fuel_level",
      label: "Fuel Level",
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getFuelLevelColor(value)}`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(value)}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "city",
      label: "Location",
      sortable: true,
    },
    {
      key: "last_delivery",
      label: "Last Delivery",
      sortable: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const loadStations = async () => {
      setLoading(true);

      // Add mock fuel level and priority data
      const enhancedStations = mockStations.map((station, index) => ({
        ...station,
        id: station.station_id,
        fuel_type: ["Gasoline", "Diesel", "Premium"][index % 3],
        fuel_level: Math.floor(Math.random() * 100),
        priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
        last_delivery: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      setStations(enhancedStations);
      setFilteredStations(enhancedStations);
      setLoading(false);
    };

    loadStations();
  }, []);

  const handleFilter = () => {
    console.log("Open filter modal");
    // TODO: Implement filter modal
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading stations...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon="⛽"
              iconBgColor="bg-blue-100"
              iconTextColor="text-blue-600"
              label="Total Stations"
              value={stations.length}
            />
            <StatCard
              icon="!"
              iconBgColor="bg-red-100"
              iconTextColor="text-red-600"
              label="High Priority Stations"
              value={filterStationsByPriority(stations, "High").length}
            />
            <StatCard
              icon="⚠"
              iconBgColor="bg-yellow-100"
              iconTextColor="text-yellow-600"
              label="Low Fuel Stations"
              value={
                filterStationsByFuelLevel(
                  stations,
                  FUEL_THRESHOLDS.LOW_FUEL,
                  "<"
                ).length
              }
            />
            <StatCard
              icon="✓"
              iconBgColor="bg-green-100"
              iconTextColor="text-green-600"
              label="Well Stocked Stations"
              value={
                filterStationsByFuelLevel(
                  stations,
                  FUEL_THRESHOLDS.WELL_STOCKED
                ).length
              }
            />
          </div>

          {/* Stations Table */}
          <DynamicTable
            data={filteredStations}
            columns={columns}
            onFilter={handleFilter}
            showFilters={true}
          />
        </div>
      </main>
    </div>
  );
}

export default StationsPage;
