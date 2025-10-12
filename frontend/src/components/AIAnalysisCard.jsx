import { SparklesIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function AIAnalysisCard({ aiAnalysis, routeSummary }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!aiAnalysis && !routeSummary) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI Route Analysis
          </h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800">
          AI Generated
        </span>
      </div>

      {/* Route Summary Info */}
      {routeSummary && (
        <div className="space-y-3 mb-4">
          {routeSummary.primaryRoute && routeSummary.primaryRoute !== "N/A" && (
            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                Primary Route:
              </span>
              <span className="text-sm font-semibold text-gray-900 text-right max-w-xs">
                {routeSummary.primaryRoute}
              </span>
            </div>
          )}

          {routeSummary.routeType && routeSummary.routeType !== "N/A" && (
            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                Route Type:
              </span>
              <span className="text-sm font-semibold text-gray-900 text-right max-w-xs">
                {routeSummary.routeType}
              </span>
            </div>
          )}

          {routeSummary.bestDepartureTime &&
            routeSummary.bestDepartureTime !== "N/A" && (
              <div className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Best Departure:
                </span>
                <span className="text-sm font-semibold text-gray-900 text-right max-w-xs">
                  {routeSummary.bestDepartureTime}
                </span>
              </div>
            )}

          {routeSummary.fuelStops && routeSummary.fuelStops !== "N/A" && (
            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                Fuel Stops:
              </span>
              <span className="text-sm font-semibold text-gray-900 text-right max-w-xs">
                {routeSummary.fuelStops}
              </span>
            </div>
          )}

          {routeSummary.estimatedFuelCost &&
            routeSummary.estimatedFuelCost !== "N/A" && (
              <div className="flex items-start justify-between py-2">
                <span className="text-sm font-medium text-gray-600">
                  Est. Fuel Cost:
                </span>
                <span className="text-sm font-semibold text-gray-900 text-right max-w-xs">
                  {routeSummary.estimatedFuelCost}
                </span>
              </div>
            )}

          {routeSummary.optimizationFactors &&
            routeSummary.optimizationFactors.length > 0 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Optimization Factors:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {routeSummary.optimizationFactors.map((factor, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Full AI Analysis (collapsible) */}
      {aiAnalysis && (
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span>Full AI Analysis</span>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                {aiAnalysis}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIAnalysisCard;
