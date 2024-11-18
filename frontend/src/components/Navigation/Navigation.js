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
        {/* Logo */}
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
          <ul className="nav nav-pills mb-0 align-items-center">
            <li className="nav-item me-3">
              <Link to="/catalog" className="nav-link text-white">
                Catalog
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item me-3">
                  <button
                    onClick={handleLogout}
                    className="nav-link btn btn-link text-white"
                  >
                    Logout
                  </button>
                </li>
                <li className="nav-item me-3">
                  <div
                    className="avatar-placeholder"
                    onClick={() => navigate("/profile")}
                    style={{ cursor: "pointer" }}
                  >
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                </li>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link text-white cart-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-shopping-cart"
                    >
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a1 1 0 0 0 .99.81h12.72a1 1 0 0 0 .98-.76l3.38-12.64H5.21"></path>
                    </svg>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <Link to="/login" className="nav-link text-white">
                    Log In
                  </Link>
                </li>
                <li className="nav-item me-3">
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
