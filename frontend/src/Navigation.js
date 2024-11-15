import React, { useState } from "react";
import "./Navigation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./iowastate.png";
import title from "./CycloneStore.png";

const Navigation = ({ page, handleNavigation }) => {
  const [moreOptionsDropdownVisible, setMoreOptionsDropdownVisible] = useState(false);
  const [manageProductsDropdownVisible, setManageProductsDropdownVisible] = useState(false);

  const toggleMoreOptionsDropdown = () => {
    setMoreOptionsDropdownVisible(!moreOptionsDropdownVisible);
    setManageProductsDropdownVisible(false); // Close manage products dropdown when more options dropdown is toggled
  };

  const toggleManageProductsDropdown = () => {
    setManageProductsDropdownVisible(!manageProductsDropdownVisible);
  };

  const closeMoreOptionsDropdown = () => {
    setMoreOptionsDropdownVisible(false);
  };

  return (
    <div className="navigation-container">
      {/* Navigation */}
      <div className="navigation-title-container d-flex justify-content-between">
        {/* Logo */}
        <button onClick={() => handleNavigation('catalog')}>
          <img src={logo} alt="Main Store Logo" className="main-store-logo" />
        </button>
        {/* Title */}
        <button onClick={() => handleNavigation('catalog')}>
          <img src={title} alt="Title Logo" className="title-logo" style={{ width: '375px', height: 'auto' }} />
        </button>
        {/* Navigation links */}
        <nav className="mb-3">
          <ul className="nav nav-pills">
            <li className="nav-item">
            <button
              className={`nav-link catalog ${page === "catalog" ? "active" : ""}`}
              onClick={() => handleNavigation("catalog")}
              style={{ fontFamily: "Impact, sans-serif",fontSize: "1.5rem" }}
            >
              Catalog
            </button>
            {/* View Cart button */}
            <button
              className={`nav-link view-cart-button ${page === "cart" ? "active" : ""}`}
              onClick={() => handleNavigation("cart")}
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              View Cart
            </button>

            </li>
            {/* More Options dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                onClick={toggleMoreOptionsDropdown}
                style={{fontSize: "1.5rem"}}
              >
                More Options
              </button>
              <ul className={`dropdown-menu custom-dropdown-menu ${moreOptionsDropdownVisible ? "show" : ""}`}>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleNavigation("aboutUs");
                      closeMoreOptionsDropdown(); // Close the dropdown after clicking
                    }}
                    
                  >
                    About Us
                  </button>
                </li>
               
                {/* Manage Products dropdown */}
                <li className="dropdown-divider"></li>
                <li className="dropdown-submenu">
                  <button
                    className="dropdown-item dropdown-toggle"
                    onClick={toggleManageProductsDropdown}
                  >
                    Manage Products
                  </button>
                  <ul className={`dropdown-menu ${manageProductsDropdownVisible ? "show" : ""}`}>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                        handleNavigation("addProduct")
                        closeMoreOptionsDropdown();
                        }}
                      >
                        Add Product
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                        handleNavigation("updateProduct")
                        closeMoreOptionsDropdown();
                      }}

                      >
                        Update Product
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                        handleNavigation("deleteProduct")
                        closeMoreOptionsDropdown();
                      }}

                      >
                        Delete Product
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            
          </ul>
        </nav>
      </div>
      
      
    </div>
  );
};

export default Navigation;
