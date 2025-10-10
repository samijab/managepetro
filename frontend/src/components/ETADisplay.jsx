import {
  ClockIcon,
  MapPinIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

function ETADisplay({ eta }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Trip Estimation
      </h3>

      <div className="space-y-4">
        {/* Arrival Time */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <ClockIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{eta.arrival}</p>
            <p className="text-sm text-gray-500">Estimated Time of Arrival</p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <RocketLaunchIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">
              {eta.duration}
            </p>
            <p className="text-sm text-gray-500">Travel Time</p>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <MapPinIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">
              {eta.distance}
            </p>
            <p className="text-sm text-gray-500">Total Trip</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">
            Route Optimized
          </span>
        </div>
      </div>
    </div>
  );
}

export default ETADisplay;
