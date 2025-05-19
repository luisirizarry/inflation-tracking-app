// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import InflationApi from "../api/InflationApi";
import useLocalStorageState from "../hooks/useLocalStorageState";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorageState("token", null);
  const [loading, setLoading] = useState(true);

  // Fetch user info when token changes
  useEffect(() => {
    async function getUser() {
      setLoading(true); // Start loading

      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        // Set token globally for API calls
        InflationApi.setToken(token);

        // Decode token to get user ID
        const decoded = jwtDecode(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          handleLogout();
          return;
        }

        setCurrentUser(decoded);
      } catch (err) {
        console.error("Error loading user from token:", err);
        handleLogout();
      }

      setLoading(false);
    }

    getUser();
  }, [token]);

  const login = async (formData) => {
    try {
      const token = await InflationApi.login(formData);

      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        errors: Array.isArray(err) ? err : [err.toString()],
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await InflationApi.signup(userData);

      setToken(response);
      return true;
    } catch (err) {
      console.error("Signup error in AuthContext:", err);
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    InflationApi.clearToken();
  };

  // Context value to be provided
  const value = {
    currentUser,
    login,
    signup,
    logout: handleLogout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export default AuthContext;
