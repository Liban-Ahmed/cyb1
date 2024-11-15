import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "./iowastate.png";
import title from "./CycloneStore.png";

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:2000/check-auth", {
          credentials: "include",
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:2000/logout", {
        method: "GET",
        credentials: "include",
      });
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="navigation-container">
      <div className="navigation-title-container d-flex justify-content-between">
        <Link to="/">
          <img src={logo} alt="Main Store Logo" className="main-store-logo" />
        </Link>
        <Link to="/">
          <img
            src={title}
            alt="Title Logo"
            className="title-logo"
            style={{ width: "375px", height: "auto" }}
          />
        </Link>
        <nav className="mb-3">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <Link to="/catalog" className="nav-link">
                Catalog
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">
                    View Cart
                  </Link>
                </li>
                {/* Add more authenticated routes */}
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link btn btn-link"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
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
