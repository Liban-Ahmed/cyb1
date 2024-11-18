import React from "react";
import { useNavigate } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer-container">
      <div className="footer-section">
        <h3>Navigation Links</h3>
        <ul className="footer-links">
          <li>
            <button
              className="footer-link-btn"
              onClick={() => navigate("/catalog")}
            >
              Catalog
            </button>
          </li>
          <li>
            <button
              className="footer-link-btn"
              onClick={() => navigate("/about-us")}
            >
              About Us
            </button>
          </li>
        </ul>
      </div>
      <div className="footer-section footer-contact">
        <h3>Contact Information</h3>
        <p>Iowa State University, Ames, USA</p>
        <p>Phone: 123-456-7890</p>
        <p>Email: info@iastate.edu</p>
      </div>
      <div className="footer-section footer-copyright">
        <h3>Copyright Information</h3>
        <p>&copy; 2024 Cyclone Innovation Store</p>
      </div>
      <div className="footer-section footer-top">
        <h3>Back to Top</h3>
        <a href="#top" className="back-to-top-link">
          Back to Top
        </a>
      </div>
    </footer>
  );
};

export default Footer;
