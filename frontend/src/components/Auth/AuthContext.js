import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:2000/check-auth", { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const logout = () => {
    axios
      .get("http://localhost:2000/logout", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
