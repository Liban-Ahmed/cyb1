import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./appfrontend"; // Your main React component
import { CartProvider } from "./CartContext"; // Import the CartProvider
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      {" "}
      {/* Wrap the App component with CartProvider */}
      <App />
    </CartProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
