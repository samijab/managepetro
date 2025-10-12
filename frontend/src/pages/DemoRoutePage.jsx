import { useState } from "react";
import ETADisplay from "../components/ETADisplay";
import InstructionsList from "../components/InstructionsList";
import WeatherImpactCard from "../components/WeatherImpactCard";
import TrafficConditionsCard from "../components/TrafficConditionsCard";
import FuelStationsCard from "../components/FuelStationsCard";
import AvailableTrucksCard from "../components/AvailableTrucksCard";
import RecentDeliveriesCard from "../components/RecentDeliveriesCard";
import DataSourcesCard from "../components/DataSourcesCard";
import AIAnalysisCard from "../components/AIAnalysisCard";
import { mockOptimizedRouteResponse } from "../data/mockRouteResponse";

/**
 * Demo page to showcase all the route optimization components
 * This page uses mock data to demonstrate the full feature set
 */
function DemoRoutePage() {
  const [showDemo, setShowDemo] = useState(false);

  // Transform mock data to match the frontend format
  const transformedData = showDemo
    ? {
        eta: {
          arrival: mockOptimizedRouteResponse.route_summary.estimated_duration,
          duration: mockOptimizedRouteResponse.route_summary.estimated_duration,
          distance: mockOptimizedRouteResponse.route_summary.total_distance,
        },
        instructions: mockOptimizedRouteResponse.directions.map((step) => ({
          id: step.step,
          text: step.instruction,
          distance: step.distance,
          direction_type: step.direction_type,
          compass_direction: step.compass_direction,
        })),
        routeSummary: {
          from: mockOptimizedRouteResponse.route_summary.from,
          to: mockOptimizedRouteResponse.route_summary.to,
          primaryRoute: mockOptimizedRouteResponse.route_summary.primary_route,
          routeType: mockOptimizedRouteResponse.route_summary.route_type,
          bestDepartureTime:
            mockOptimizedRouteResponse.route_summary.best_departure_time,
          weatherImpact: mockOptimizedRouteResponse.route_summary.weather_impact,
          fuelStops: mockOptimizedRouteResponse.route_summary.fuel_stops,
          estimatedFuelCost:
            mockOptimizedRouteResponse.route_summary.estimated_fuel_cost,
          optimizationFactors:
            mockOptimizedRouteResponse.route_summary.optimization_factors,
        },
        weatherImpact: {
          fromLocation: mockOptimizedRouteResponse.weather_impact.from_location,
          toLocation: mockOptimizedRouteResponse.weather_impact.to_location,
          routeImpact: mockOptimizedRouteResponse.weather_impact.route_impact,
          drivingConditions:
            mockOptimizedRouteResponse.weather_impact.driving_conditions,
        },
        trafficConditions: mockOptimizedRouteResponse.traffic_conditions,
        fuelStations: mockOptimizedRouteResponse.fuel_stations,
        recentDeliveries: mockOptimizedRouteResponse.recent_deliveries,
        availableTrucks: mockOptimizedRouteResponse.available_trucks,
        aiAnalysis: mockOptimizedRouteResponse.ai_analysis,
        dataSources: mockOptimizedRouteResponse.data_sources,
      }
    : null;

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Demo Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                🎨 Component Demo Mode
              </h2>
              <p className="text-sm text-gray-600">
                Toggle to see all route optimization components with sample data
              </p>
            </div>
            <button
              onClick={() => setShowDemo(!showDemo)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                showDemo
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {showDemo ? "Hide Demo" : "Show Demo"}
            </button>
          </div>

          {showDemo && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Route:</strong> Toronto, ON → Montreal, QC
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Data shown below represents the complete API response structure
              </p>
            </div>
          )}
        </div>

        {/* Component Display */}
        {transformedData && (
          <div className="space-y-8">
            {/* Main route information - side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ETADisplay eta={transformedData.eta} />
              </div>

              <div className="lg:col-span-2">
                <InstructionsList instructions={transformedData.instructions} />
              </div>
            </div>

            {/* Additional route details - 2 column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weather Impact Card */}
              <WeatherImpactCard weatherImpact={transformedData.weatherImpact} />

              {/* Traffic Conditions Card */}
              <TrafficConditionsCard
                trafficConditions={transformedData.trafficConditions}
              />
            </div>

            {/* Resource Cards - 2 column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fuel Stations Card */}
              <FuelStationsCard fuelStations={transformedData.fuelStations} />

              {/* Available Trucks Card */}
              <AvailableTrucksCard trucks={transformedData.availableTrucks} />
            </div>

            {/* Recent Deliveries and Data Sources - 2 column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Deliveries Card */}
              <RecentDeliveriesCard
                deliveries={transformedData.recentDeliveries}
              />

              {/* Data Sources Card */}
              <DataSourcesCard dataSources={transformedData.dataSources} />
            </div>

            {/* AI Analysis Card - Full width */}
            <AIAnalysisCard
              aiAnalysis={transformedData.aiAnalysis}
              routeSummary={transformedData.routeSummary}
            />
          </div>
        )}

        {/* Instructions when demo is off */}
        {!showDemo && (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to the Route Optimization Demo
              </h3>
              <p className="text-gray-600 mb-6">
                Click the "Show Demo" button above to see all the enhanced
                components that consume and display data from the optimize route
                API endpoint.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Components included:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ ETA Display - Trip estimation with distance and duration</li>
                  <li>✓ Turn-by-Turn Directions - Detailed route instructions</li>
                  <li>✓ Weather Impact Card - Conditions for origin and destination</li>
                  <li>✓ Traffic Conditions Card - Traffic analysis and timing</li>
                  <li>✓ Fuel Stations Card - Nearby stations with inventory levels</li>
                  <li>✓ Available Trucks Card - Trucks ready for assignment</li>
                  <li>✓ Recent Deliveries Card - Historical delivery data</li>
                  <li>✓ Data Sources Card - Optimization data availability</li>
                  <li>✓ AI Analysis Card - Comprehensive AI-generated recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default DemoRoutePage;
