import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // Make sure the name matches with the filename
import { CartProvider } from "./components/Cart/CartContext"; // Adjusted path for CartContext
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
