import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.css";
import Navigation from "./Navigation";
import Catalog from "./Catalog";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import CartPage from "./CartPage";
import DeleteProduct from "./DeleteProduct";
import AboutUs from "./AboutUs";
import Footer from "./footer";


const App = () => {
  const [page, setPage] = useState("catalog");

  const handleNavigation = (newPage) => {
    setPage(newPage);
  };

  const renderPage = () => {
    switch (page) {
      case "catalog":
        return <Catalog />;
      case "addProduct":
        return <AddProduct />;
      case "updateProduct":
        return <UpdateProduct />;
      case "deleteProduct":
        return <DeleteProduct />;
      case "aboutUs": // Add About Us page
        return <AboutUs />;
        case "cart":
          return <CartPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div>
      <Navigation page={page} handleNavigation={handleNavigation} />
      {/* Render the current page */}
      {renderPage()}
      {/* Footer */}
      <Footer handleNavigation={handleNavigation} />
      {/* Custom CSS */}
      <style jsx>{`
        .navigation-title-container {
          background-color: #C8102E; /* Example color, you can change this */
          padding: 20px; /* Adjust padding as needed */
          color: white; /* Text color */
        }
      `}</style>
    </div>
  );
};

// NotFoundPage component
function NotFoundPage() {
  return <div>Page not found.</div>;
}

export default App;
