import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const llmOptions = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "claude-3", label: "Claude 3" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "llama-2", label: "Llama 2" },
];

const pageConfig = {
  "/": { title: "Route Optimization", showLLMDropdown: true },
  "/stations": { title: "Loading Stations", showLLMDropdown: false },
  "/trucks": { title: "Fleet Management", showLLMDropdown: false },
  "/dashboard": { title: "Dashboard Overview", showLLMDropdown: false },
};

function Header({ selectedLLM, onLLMChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const currentPageConfig = pageConfig[location.pathname] || pageConfig["/"];
  const selectedOption = llmOptions.find(
    (option) => option.value === selectedLLM
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Manage Petro
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Routes
              </Link>
              <Link
                to="/stations"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/stations"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Stations
              </Link>
            </nav>
          </div>

          {/* Centered Dynamic Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentPageConfig.title}
            </h1>
          </div>

          {/* LLM Dropdown (conditional) */}
          <div className="flex items-center">
            {currentPageConfig.showLLMDropdown && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {selectedOption?.label}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      {llmOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onLLMChange(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            selectedLLM === option.value
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
