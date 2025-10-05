import { useState } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentPageConfig = pageConfig[location.pathname] || pageConfig["/"];
  const selectedOption = llmOptions.find(
    (option) => option.value === selectedLLM
  );

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-2"
                onClick={closeMobileMenu}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MP</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Manage Petro
                </span>
              </Link>
            </div>

            {/* Center Section - Navigation and Title */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-8">
                {/* Desktop Navigation */}
                <nav className="flex items-center space-x-6">
                  <Link
                    to="/"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/"
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Route Optimization
                  </Link>
                  <Link
                    to="/stations"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/stations"
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Station Tracking
                  </Link>
                </nav>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Page Title */}
                <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
                  {currentPageConfig.title}
                </h1>
              </div>
            </div>

            {/* Mobile Title - Only shown on medium screens */}
            <div className="hidden md:block lg:hidden flex-1 text-center">
              <h1 className="text-lg font-bold text-gray-800">
                {currentPageConfig.title}
              </h1>
            </div>

            {/* Right side - LLM Dropdown and Mobile Menu */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* LLM Dropdown - Desktop */}
              {currentPageConfig.showLLMDropdown && (
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-lg transition-colors"
                  >
                    <span className="text-xs lg:text-sm font-medium text-gray-700">
                      {selectedOption?.label}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {/* Mobile Page Title */}
              <div className="md:hidden px-2 py-3 border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-800">
                  {currentPageConfig.title}
                </h1>
              </div>

              {/* Mobile Navigation Links */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Route Optimization
              </Link>
              <Link
                to="/stations"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === "/stations"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Station Tracking
              </Link>

              {/* Mobile LLM Dropdown */}
              {currentPageConfig.showLLMDropdown && (
                <div className="px-3 py-2 border-t border-gray-100 mt-2">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    LLM Model
                  </div>
                  <div className="space-y-1">
                    {llmOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onLLMChange(option.value);
                          closeMobileMenu();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedLLM === option.value
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-25"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
}

export default Header;
