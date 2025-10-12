import { MapPinIcon } from "@heroicons/react/24/outline";

function FuelStationsCard({ fuelStations }) {
  // Filter stations to only show those with valid location data (city or region)
  const validStations = fuelStations?.filter(station => station.city || station.region) || [];
  
  if (validStations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Nearby Fuel Stations
        </h3>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {validStations.length} stations
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {validStations.map((station, index) => (
          <div
            key={station.station_id || index}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="flex-shrink-0 mt-1">
              <MapPinIcon className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {station.name || "Unnamed Station"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {station.city && station.region
                      ? `${station.city}, ${station.region}`
                      : station.city || station.region}
                  </p>
                </div>
                {station.fuel_level !== undefined && (
                  <div className="ml-2 flex-shrink-0">
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        station.fuel_level >= 70
                          ? "bg-green-100 text-green-800"
                          : station.fuel_level >= 40
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {station.fuel_level}%
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {station.fuel_type && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {station.fuel_type}
                  </span>
                )}
                {station.capacity_liters && (
                  <span className="text-gray-500">
                    Capacity: {station.capacity_liters.toLocaleString()}L
                  </span>
                )}
                {station.current_level_liters !== undefined && (
                  <span className="text-gray-500">
                    Current: {station.current_level_liters.toLocaleString()}L
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FuelStationsCard;
