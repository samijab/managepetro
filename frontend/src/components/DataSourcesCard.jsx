import { ChartBarIcon } from "@heroicons/react/24/outline";

/**
 * DataSourcesCard - Display metadata about data sources used in optimization
 * Shows counts and availability of different data sources
 */
function DataSourcesCard({ dataSources }) {
  if (!dataSources) {
    return null;
  }

  const dataItems = [
    {
      label: "Database Stations",
      value: dataSources.database_stations || 0,
      icon: "🏢",
    },
    {
      label: "Recent Deliveries",
      value: dataSources.recent_deliveries || 0,
      icon: "🚚",
    },
    {
      label: "Available Trucks",
      value: dataSources.available_trucks || 0,
      icon: "🚛",
    },
    {
      label: "Weather Data",
      value: dataSources.weather_data || "N/A",
      icon: "🌤️",
    },
    {
      label: "AI Analysis",
      value: dataSources.ai_analysis || "N/A",
      icon: "🤖",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
          <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Data Sources</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Optimization data availability
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {dataItems.map((item, index) => (
          <div
            key={index}
            className="p-2 sm:p-3 bg-indigo-50 rounded-lg border border-indigo-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{item.label}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {typeof item.value === "number" ? item.value : item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Real-time data integration provides comprehensive route optimization
        </p>
      </div>
    </div>
  );
}

export default DataSourcesCard;
