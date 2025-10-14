import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import LoadingSpinner from "../LoadingSpinner";

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Manage Petro
            </h1>
            <p className="text-gray-600">
              Please sign in to access the fuel management system
            </p>
          </div>

          {showRegister ? (
            <RegisterForm
              onSuccess={() => {
                // User will be automatically logged in after registration
              }}
              onSwitchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <LoginForm
              onSuccess={() => {
                // User will be automatically redirected after login
              }}
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
    >
      Sign Out
    </button>
  );
};

export default AuthGuard;
