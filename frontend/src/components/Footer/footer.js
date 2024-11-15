import React from "react";
import "./footer.css";

const Footer = ({ handleNavigation }) => {
  return (
    <div className="footer-container">
      <div className="footer-section">
        <h3>Navigation Links</h3>
        <ul>
        <li><button onClick={() => handleNavigation("catalog")}>Catalog</button></li>
        <li><button onClick={() => handleNavigation("aboutUs")}>About Us</button></li>
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
        <a href="#top">Back to Top</a>
      </div>
    </div>
  );
};

export default Footer;
