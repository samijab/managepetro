import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function RouteForm({ onSubmit, isLoading = false }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [timeMode, setTimeMode] = useState("departure");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from.trim() && to.trim() && !isLoading) {
      const timeData = {
        timeMode,
        departureTime: timeMode === "departure" ? departureTime : null,
        arrivalTime: timeMode === "arrival" ? arrivalTime : null,
      };
      onSubmit(from.trim(), to.trim(), timeData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Input */}
          <div className="space-y-2">
            <label
              htmlFor="from"
              className="block text-sm font-medium text-gray-700"
            >
              From
            </label>
            <div className="relative">
              <input
                type="text"
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Enter starting location"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* To Input */}
          <div className="space-y-2">
            <label
              htmlFor="to"
              className="block text-sm font-medium text-gray-700"
            >
              To
            </label>
            <div className="relative">
              <input
                type="text"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter destination"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Time Mode Selection */}
        <div className="space-y-3 border-t pt-4">
          <label className="block text-sm font-medium text-gray-700">
            Time Preference (Optional)
          </label>
          
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="timeMode"
                value="departure"
                checked={timeMode === "departure"}
                onChange={(e) => setTimeMode(e.target.value)}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Departure Time</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="timeMode"
                value="arrival"
                checked={timeMode === "arrival"}
                onChange={(e) => setTimeMode(e.target.value)}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Arrival Time</span>
            </label>
          </div>

          {/* Time Input */}
          <div className="relative">
            <input
              type="time"
              id="timeInput"
              value={timeMode === "departure" ? departureTime : arrivalTime}
              onChange={(e) =>
                timeMode === "departure"
                  ? setDepartureTime(e.target.value)
                  : setArrivalTime(e.target.value)
              }
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={
                timeMode === "departure"
                  ? "Select departure time"
                  : "Select arrival time"
              }
            />
            <ClockIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          
          <p className="text-xs text-gray-500">
            {timeMode === "departure"
              ? "AI will calculate when you'll arrive"
              : "AI will calculate when you should leave"}
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!from.trim() || !to.trim() || isLoading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <span>Optimize Route</span>
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RouteForm;
