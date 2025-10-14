import { SignalIcon } from "@heroicons/react/24/outline";

function TrafficConditionsCard({ trafficConditions }) {
  if (!trafficConditions || Object.keys(trafficConditions).length === 0) {
    return null;
  }

  const {
    current_traffic,
    typical_time,
    best_departure,
    delays,
    ai_analysis,
  } = trafficConditions;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Traffic Conditions
        </h3>
        <SignalIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
      </div>

      <div className="space-y-2 sm:space-y-3">
        {current_traffic && (
          <div className="flex items-start justify-between py-2 border-b border-gray-100">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Current Traffic:
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 text-right max-w-xs">
              {current_traffic}
            </span>
          </div>
        )}

        {typical_time && (
          <div className="flex items-start justify-between py-2 border-b border-gray-100">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Typical Time:
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 text-right max-w-xs">
              {typical_time}
            </span>
          </div>
        )}

        {best_departure && (
          <div className="flex items-start justify-between py-2 border-b border-gray-100">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Best Departure:
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 text-right max-w-xs">
              {best_departure}
            </span>
          </div>
        )}

        {delays && (
          <div className="flex items-start justify-between py-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Expected Delays:
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 text-right max-w-xs">
              {delays}
            </span>
          </div>
        )}

        {ai_analysis && (
          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-800 font-medium">
              AI-Generated Traffic Analysis
            </p>
          </div>
        )}

        {!current_traffic &&
          !typical_time &&
          !best_departure &&
          !delays &&
          ai_analysis && (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
              Traffic analysis included in AI recommendations
            </p>
          )}
      </div>
    </div>
  );
}

export default TrafficConditionsCard;
