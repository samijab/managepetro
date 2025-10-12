import { XMarkIcon, TruckIcon, MapIcon } from "@heroicons/react/24/outline";

function DispatchResultCard({ result, onClose }) {
  const { dispatch_summary, truck, route_stops, ai_analysis } = result;

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TruckIcon className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Dispatch Optimization Result</h2>
              <p className="text-sm text-blue-100">
                {truck.code} - {truck.plate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Dispatch Summary */}
        {dispatch_summary && Object.keys(dispatch_summary).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Dispatch Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {dispatch_summary.total_stations && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Stations to Visit</div>
                  <div className="text-xl font-bold text-blue-600">
                    {dispatch_summary.total_stations}
                  </div>
                </div>
              )}
              {dispatch_summary.total_distance && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Total Distance</div>
                  <div className="text-xl font-bold text-green-600">
                    {dispatch_summary.total_distance}
                  </div>
                </div>
              )}
              {dispatch_summary.estimated_duration && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Estimated Duration</div>
                  <div className="text-xl font-bold text-purple-600">
                    {dispatch_summary.estimated_duration}
                  </div>
                </div>
              )}
              {dispatch_summary.total_fuel && (
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Total Fuel Delivery</div>
                  <div className="text-xl font-bold text-orange-600">
                    {dispatch_summary.total_fuel}
                  </div>
                </div>
              )}
            </div>

            {/* Timing */}
            {(dispatch_summary.departure_time || dispatch_summary.return_time) && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {dispatch_summary.departure_time && (
                  <div>
                    <span className="text-gray-600">Departure Time:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {dispatch_summary.departure_time}
                    </span>
                  </div>
                )}
                {dispatch_summary.return_time && (
                  <div>
                    <span className="text-gray-600">Return to Depot:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {dispatch_summary.return_time}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Route Stops */}
        {route_stops && route_stops.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MapIcon className="w-5 h-5 mr-2" />
              Optimized Route ({route_stops.length} stops)
            </h3>
            <div className="space-y-3">
              {route_stops.map((stop, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {stop.station}
                      </h4>
                      <div className="mt-2 text-sm space-y-1">
                        {stop.distance && (
                          <div>
                            <span className="text-gray-600">Distance:</span>
                            <span className="ml-2 text-gray-900">{stop.distance}</span>
                          </div>
                        )}
                        {stop.fuel_delivery && (
                          <div>
                            <span className="text-gray-600">Fuel to Deliver:</span>
                            <span className="ml-2 font-medium text-blue-600">
                              {stop.fuel_delivery}
                            </span>
                          </div>
                        )}
                        {stop.eta && (
                          <div>
                            <span className="text-gray-600">ETA:</span>
                            <span className="ml-2 text-gray-900">{stop.eta}</span>
                          </div>
                        )}
                        {stop.reason && (
                          <div>
                            <span className="text-gray-600">Reason:</span>
                            <span className="ml-2 text-gray-700">{stop.reason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Truck Compartments */}
        {truck.compartments && truck.compartments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Truck Compartments
            </h3>
            <div className="space-y-2">
              {truck.compartments.map((comp) => (
                <div
                  key={comp.compartment_number}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      Compartment {comp.compartment_number}
                    </span>
                    <span className="text-sm text-gray-600">
                      {comp.fuel_type}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {comp.current_level_liters.toLocaleString()} L available
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {ai_analysis && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              AI Analysis
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {ai_analysis}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default DispatchResultCard;
