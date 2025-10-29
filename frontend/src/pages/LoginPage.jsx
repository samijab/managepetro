import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleLogin = async ({ username, password }) => {
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleRegister = async ({ username, password, email }) => {
    try {
      await register(username, password, email);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {showRegister ? (
          <RegisterForm
            onRegister={handleRegister}
            error={error}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onSuccess={() => navigate("/")}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    </div>
  );
}
