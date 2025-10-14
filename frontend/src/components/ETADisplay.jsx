import {
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

function ETADisplay({ eta }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
        Trip Estimation
      </h3>

      <div className="space-y-3 sm:space-y-4">
        {/* Duration */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{eta.duration}</p>
            <p className="text-xs sm:text-sm text-gray-500">Estimated Travel Time</p>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">
              {eta.distance}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Total Trip</p>
          </div>
        </div>

        {/* Recommended Arrival Time */}
        {eta.recommendedArrival && (
          <div className="flex items-center space-x-3 pt-2 border-t border-gray-200">
            <div className="flex-shrink-0">
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {eta.recommendedArrival}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Expected Arrival</p>
            </div>
          </div>
        )}

        {/* Recommended Departure Time */}
        {eta.recommendedDeparture && (
          <div className="flex items-center space-x-3 pt-2 border-t border-gray-200">
            <div className="flex-shrink-0">
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {eta.recommendedDeparture}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Recommended Departure</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 sm:mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs sm:text-sm font-medium text-green-800">
            Route Optimized
          </span>
        </div>
      </div>
    </div>
  );
}

export default ETADisplay;
