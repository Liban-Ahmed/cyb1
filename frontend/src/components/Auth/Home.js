import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="home-container">
      <h1>Welcome to Cyclone Innovation Store</h1>
      <p>Your one-stop marketplace for Iowa State Students.</p>
      <div className="home-buttons">
        <button onClick={handleLogin} className="btn btn-primary">
          Log In
        </button>
        <button onClick={handleRegister} className="btn btn-secondary">
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
