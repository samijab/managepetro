import { useState, useCallback } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const currentPageConfig = pageConfig[location.pathname] || pageConfig["/"];
  const selectedOption = llmOptions.find(
    (option) => option.value === selectedLLM
  );

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
  }, [logout]);

  const handleLLMChange = useCallback(
    (value) => {
      onLLMChange(value);
      setIsDropdownOpen(false);
    },
    [onLLMChange]
  );


  return (
    <>
      <header className="bg-gray-600 shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16 sm:h-20">
            {/* Logo - Responsive width */}
            <div className="flex items-center flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-64">
              <Link
                to="/"
                className="flex items-center"
                onClick={closeMobileMenu}
              >
                {/* Logo with consistent brand colors */}
                <div className="w-28 h-12 sm:w-32 sm:h-14 md:w-36 md:h-14 lg:w-40 lg:h-16 drop-shadow-xl">
                  <img
                    src={managePetroLogo}
                    alt="Manage Petro"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Center Section - Navigation (Responsive) */}
            <div className="hidden lg:flex justify-center flex-1">
              <nav className="flex items-center space-x-4 xl:space-x-6">
                <Link
                  to="/"
                  className={`text-base lg:text-lg font-medium transition-colors ${
                    location.pathname === "/"
                      ? "text-orange-500 hover:text-orange-300"
                      : "text-white hover:text-orange-300"
                  }`}
                >
                  Route Optimization
                </Link>
                <Link
                  to="/dispatcher"
                  className={`text-base lg:text-lg font-medium transition-colors ${
                    location.pathname === "/dispatcher"
                      ? "text-orange-500 hover:text-orange-300"
                      : "text-white hover:text-orange-300"
                  }`}
                >
                  Dispatcher
                </Link>
                <Link
                  to="/stations"
                  className={`text-base lg:text-lg font-medium transition-colors ${
                    location.pathname === "/stations"
                      ? "text-orange-500 hover:text-orange-300"
                      : "text-white hover:text-orange-300"
                  }`}
                >
                  Stations
                </Link>
              </nav>
            </div>

            {/* Right side - Responsive width */}
            <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-shrink-0 w-auto sm:w-48 md:w-56 lg:w-64">
              {/* LLM Dropdown - Always reserve space */}
              <div className="hidden sm:block relative">
                {currentPageConfig.showLLMDropdown ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-colors"
                  >
                    <span className="text-xs lg:text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-none">
                      {selectedOption?.label}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </button>
                ) : (
                  // Invisible placeholder to maintain spacing - responsive
                  <div className="w-16 sm:w-20 lg:w-24 h-10"></div>
                )}

                {isDropdownOpen && currentPageConfig.showLLMDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      {llmOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleLLMChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            selectedLLM === option.value
                              ? "bg-blue-50 text-orange-500 font-medium"
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

              {/* User Menu */}
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-2 rounded-lg transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[80px] sm:max-w-none">
                    {user?.username || "User"}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                      {user ? (<span>Sign Out</span>) 
                      :(<span>Sign In</span>)}
                      </button>
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
                    ? "text-orange-500  hover:text-orange-300 bg-blue-50"
                    : "text-orange-500  hover:text-orange-300 hover:bg-gray-50"
                }`}
              >
                Route Optimization
              </Link>
              <Link
                to="/dispatcher"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === "/dispatcher"
                    ? "text-orange-500  hover:text-orange-300 bg-blue-50"
                    : "text-orange-500  hover:text-orange-300 hover:bg-gray-50"
                }`}
              >
                Dispatcher
              </Link>
              <Link
                to="/stations"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === "/stations"
                    ? "text-orange-500 hover:text-orange-300 bg-blue-50"
                    : "text-orange-500  hover:text-orange-300 hover:bg-gray-50"
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
                          handleLLMChange(option.value);
                          closeMobileMenu();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedLLM === option.value
                            ? "bg-blue-50 text-orange-500 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile User Menu */}
              <div className="px-3 py-2 border-t border-gray-100 mt-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Account
                </div>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
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
