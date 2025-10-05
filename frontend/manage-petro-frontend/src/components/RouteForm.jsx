import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

function RouteForm({ onSubmit }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from.trim() && to.trim()) {
      onSubmit(from.trim(), to.trim());
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!from.trim() || !to.trim()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>Optimize Route</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default RouteForm;
