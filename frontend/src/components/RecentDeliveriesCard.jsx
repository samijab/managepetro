import { TruckIcon } from "@heroicons/react/24/outline";

/**
 * RecentDeliveriesCard - Display recent fuel deliveries
 * Shows delivery history relevant to the route planning
 */
function RecentDeliveriesCard({ deliveries }) {
  if (!deliveries || deliveries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg flex-shrink-0">
          <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Recent Deliveries</h3>
          <p className="text-xs sm:text-sm text-gray-600">Historical delivery data</p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {deliveries.map((delivery, index) => (
          <div
            key={delivery.delivery_id || index}
            className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {delivery.station || "Unknown Station"}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {delivery.location || "Unknown Location"}
                </p>
              </div>
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  delivery.status?.toLowerCase() === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {delivery.status || "Unknown"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 text-xs sm:text-sm">
              <div>
                <p className="text-gray-600">Volume</p>
                <p className="font-semibold text-gray-900 truncate">
                  {delivery.volume || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-semibold text-gray-900 truncate">
                  {delivery.date
                    ? new Date(delivery.date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Truck</p>
                <p className="font-semibold text-gray-900 truncate">
                  {delivery.truck || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deliveries.length === 0 && (
        <p className="text-center text-sm sm:text-base text-gray-500 py-4">
          No recent deliveries found
        </p>
      )}
    </div>
  );
}

export default RecentDeliveriesCard;
