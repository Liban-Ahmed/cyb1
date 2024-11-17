import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Auth/Home";
import Login from "./components/Auth/LoginForm";
import Register from "./components/Auth/RegistrationForm";
import Catalog from "./components/Catalog/Catalog";
import AddProduct from "./components/AddProduct/AddProduct";
import UpdateProduct from "./components/UpdateProduct/UpdateProduct";
import DeleteProduct from "./components/DeleteProduct/DeleteProduct";
import CartPage from "./components/Cart/CartPage";
import AboutUs from "./components/AboutUs/AboutUs";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/footer";
import { AuthProvider } from "./components/Auth/AuthContext";
import UserProfile from "./components/UserProfile/UserProfile";

const App = () => {
  return (
    <AuthProvider>
      {" "}
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product" element={<UpdateProduct />} />
          <Route path="/delete-product" element={<DeleteProduct />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

// NotFoundPage component for handling incorrect paths
function NotFoundPage() {
  return <div>Page not found.</div>;
}

export default App;
