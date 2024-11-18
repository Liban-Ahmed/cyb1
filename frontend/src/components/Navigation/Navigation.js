import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navigation.css";
import logo from "./iowastate.png";

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:2000/check-auth", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuthenticated);
        if (response.data.isAuthenticated) {
          const userProfileResponse = await axios.get(
            "http://localhost:2000/profile",
            { withCredentials: true }
          );
          setUser(userProfileResponse.data);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:2000/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUser({});
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="navigation-container bg-gray-800 p-3">
      <div className="navigation-title-container d-flex justify-content-between align-items-center">
        {/* Logo and Title */}
        <div className="d-flex align-items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Main Store Logo"
              className="main-store-logo me-3"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav nav-pills mb-0">
            <li className="nav-item">
              <Link to="/catalog" className="nav-link text-white">
                Catalog
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link text-white">
                    View Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link btn btn-link text-white"
                  >
                    Logout
                  </button>
                </li>
                <li className="nav-item">
                  <div
                    className="avatar-placeholder ms-3"
                    onClick={() => navigate("/profile")}
                    style={{ cursor: "pointer" }}
                  >
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-white">
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link text-white">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
