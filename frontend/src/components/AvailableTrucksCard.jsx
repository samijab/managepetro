import { TruckIcon } from "@heroicons/react/24/outline";

function AvailableTrucksCard({ trucks }) {
  // Filter trucks to only show those with valid plate_number or truck_id
  const validTrucks = trucks?.filter(truck => truck.plate_number || truck.truck_id) || [];
  
  if (validTrucks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Available Trucks
        </h3>
        <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {validTrucks.length} available
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {validTrucks.map((truck, index) => (
          <div
            key={truck.truck_id || index}
            className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="flex-shrink-0 mt-1">
              <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {truck.plate_number || truck.truck_id}
                  </p>
                  {truck.code && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {truck.code}
                    </p>
                  )}
                </div>
                {truck.status && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ml-2 ${
                      truck.status === "active"
                        ? "bg-green-100 text-green-800"
                        : truck.status === "maintenance"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {truck.status}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {truck.fuel_type && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {truck.fuel_type}
                  </span>
                )}
                {truck.capacity_liters && (
                  <span className="text-gray-500">
                    Capacity: {truck.capacity_liters.toLocaleString()}L
                  </span>
                )}
                {truck.fuel_level_percent !== undefined && (
                  <span className="text-gray-500">
                    Fuel: {truck.fuel_level_percent}%
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

export default AvailableTrucksCard;
