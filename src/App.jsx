import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

const AUTH_USER_KEY = "city2035_user";
const AUTH_SESSION_KEY = "city2035_session";

function App() {
  const [initialAuthState] = useState(() => {
    const savedSession = localStorage.getItem(AUTH_SESSION_KEY);
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    const canRestoreSession = savedSession === "true" && Boolean(savedUser);

    return {
      isAuthenticated: canRestoreSession,
      currentUser: canRestoreSession ? JSON.parse(savedUser) : null,
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState.isAuthenticated);
  const [currentUser, setCurrentUser] = useState(initialAuthState.currentUser);

  function handleSignup(newUser) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  }

  function handleLogin(email, password, rememberMe) {
    const savedUserRaw = localStorage.getItem(AUTH_USER_KEY);
    if (!savedUserRaw) {
      return { ok: false, message: "No account found. Please create one first." };
    }

    const savedUser = JSON.parse(savedUserRaw);
    const emailMatch = savedUser.email.toLowerCase() === email.toLowerCase();
    const passwordMatch = savedUser.password === password;

    if (!emailMatch || !passwordMatch) {
      return { ok: false, message: "Invalid email or password." };
    }

    localStorage.setItem(AUTH_SESSION_KEY, "true");
    localStorage.setItem("city2035_remember", rememberMe ? "true" : "false");

    setIsAuthenticated(true);
    setCurrentUser(savedUser);
    return { ok: true };
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup onSignup={handleSignup} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
