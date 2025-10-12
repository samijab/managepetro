import { useState } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import managePetroLogo from "../assets/manage-petro-logo.png";

const llmOptions = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "claude-3", label: "Claude 3" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "llama-2", label: "Llama 2" },
];

const pageConfig = {
  "/": { showLLMDropdown: true },
  "/stations": { showLLMDropdown: false },
  "/dispatcher": { showLLMDropdown: false },
  "/trucks": { showLLMDropdown: false },
  "/dashboard": { showLLMDropdown: false },
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
          <div className="flex items-center h-20">
            {/* Logo - Fixed width */}
            <div className="flex items-center flex-shrink-0 w-64">
              <Link
                to="/"
                className="flex items-center"
                onClick={closeMobileMenu}
              >
                {/* Logo with consistent brand colors */}
                <div className="w-40 h-16 bg-gradient-to-br from-slate-600 to-slate-700 border border-slate-500 rounded-xl px-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <img
                    src={managePetroLogo}
                    alt="Manage Petro"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Center Section - Navigation (Fixed position) */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-6">
                <Link
                  to="/"
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === "/"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Route Optimization
                </Link>
                <Link
                  to="/dispatcher"
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === "/dispatcher"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dispatcher
                </Link>
                <Link
                  to="/stations"
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === "/stations"
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Stations
                </Link>
              </nav>
            </div>

            {/* Right side - Fixed width to prevent shifting */}
            <div className="flex items-center justify-end space-x-2 flex-shrink-0 w-64">
              {/* LLM Dropdown - Always reserve space */}
              <div className="hidden sm:block relative">
                {currentPageConfig.showLLMDropdown ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-lg transition-colors"
                  >
                    <span className="text-xs lg:text-sm font-medium text-gray-700">
                      {selectedOption?.label}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </button>
                ) : (
                  // Invisible placeholder to maintain spacing
                  <div className="w-24 h-10"></div>
                )}

                {isDropdownOpen && currentPageConfig.showLLMDropdown && (
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
                to="/dispatcher"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === "/dispatcher"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Dispatcher
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
                Stations
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
          className="lg:hidden fixed inset-0 z-30 bg-black opacity-40"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
}

export default Header;
