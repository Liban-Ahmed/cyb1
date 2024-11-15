import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DeleteProduct.css";

const DeleteProduct = () => {
  const [productId, setProductId] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [productData, setProductData] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [setDeleteValidationMessage] = useState("");
  const handleInputChange = (event) => {
    setProductId(event.target.value);
    setProductData(null); // Clear previous product data when input changes
  };

  const handleProductSearch = () => {
    fetch(`http://127.0.0.1:2000/catalog/id/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found.");
        }
        return response.json();
      })
      .then((data) => {
        setProductData(data); // Update state with product data
        setShowConfirmation(true); // Show confirmation section
        setValidationMessage("");
      })
      .catch((error) => {
        console.error("Error retrieving product:", error);
        setValidationMessage("Product not found.");
      });
  };

  const handleConfirm = () => {
    // Perform validation
    if (!lastName) {
      setValidationMessage("Please enter first and last name.");
      return;
    }

    // Validation passed, proceed to show product info and delete button
    setValidationMessage("");
    setShowConfirmation(false); // Hide confirmation section

    // Additional validation for first and last name match
  if (productData && (firstName !== productData.firstname || lastName !== productData.lastname)) {
    setValidationMessage("Incorrect first name or last name.");
    return;
  }
  };

 const handleDeleteProduct = () => {
    if (!productId || !lastName) {
      setDeleteValidationMessage("Please enter both product ID and last name.");
      return;
    }

    if (!productData || lastName !== productData.lastname) {
      setDeleteValidationMessage("Incorrect last name.");
      return;
    }

    // Display confirmation popup
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) {
      return; // Do nothing if user cancels
    }

    fetch(`http://127.0.0.1:2000/catalog/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
        setValidationMessage("Product deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        setValidationMessage("Failed to delete product. Please try again.");
      });
  };

  return (
    <div className="container" style={{ height: "1200px" }}>
      <div className="red-container">
        <h2 style={{ color: "white" }}>Delete Product</h2>
      </div>
      {validationMessage && <p className="text-danger">{validationMessage}</p>}

      <div className="mb-3" style={{ marginBottom: "20px" }}>
        <label htmlFor="productId" className="form-label">
          Product ID:
        </label>
        <input
          type="text"
          className="form-control"
          id="productId"
          value={productId}
          onChange={handleInputChange}
        />
        <button
          className="btn btn-primary mt-2"
          style={{
            backgroundColor: "#C8102E",
            width: "175px",
            height: "50px",
            fontSize: "22px",
          }}
          onClick={handleProductSearch}
        >
          Search Product
        </button>
      </div>

      {showConfirmation && (
  <div className="mb-3" style={{ marginBottom: "20px" }}>
    <div style={{ display: "flex", gap: "10px" }}>
      <div style={{ flex: "1" }}>
        <label htmlFor="firstName" className="form-label">
          First Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div style={{ flex: "1" }}>
        <label htmlFor="lastName" className="form-label">
          Last Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
    </div>
    <button
      className="btn btn-primary mt-2"
      style={{
        backgroundColor: "#C8102E",
        width: "175px",
        height: "50px",
        fontSize: "22px",
      }}
      onClick={handleConfirm}
    >
      Confirm
    </button>
    {validationMessage && <p className="text-danger">{validationMessage}</p>}
  </div>
)}


{productData && firstName === productData.firstname && lastName === productData.lastname && !showConfirmation && (
  <div>
    <div className="mb-3" style={{ display: "flex", marginTop: "50px" }}>
      <div style={{ flex: 1 }}>
        <div className="red-background rounded-container">
          <img
            src={productData.image}
            alt="Product"
            style={{ maxWidth: "300px", borderRadius: "10px" }}
          />
        </div>
      </div>
      <div style={{ flex: 2, paddingLeft: "20px", fontSize: "24px" }}>
        <h3 style={{ color: "white", fontFamily: "Impact, sans-serif", backgroundColor: "#C8102E", padding: "10px", borderRadius: "5px", display: "inline-Block" }}>
          {productData.title}
        </h3>
        <p style={{ color: "white", fontFamily: "Impact, sans-serif" }}>
          <strong>Category:</strong> {productData.category}
        </p>
        <p style={{ color: "white", fontFamily: "Impact, sans-serif" }}>
          <strong>Price:</strong> ${productData.price}
        </p>
        <p style={{ color: "white", fontFamily: "Impact, sans-serif" }}>
          <strong>Description:</strong> {productData.description}
        </p>
       
      </div>
    </div>
    <button
      className="btn btn-danger"
      onClick={handleDeleteProduct}
      style={{
        backgroundColor: "#C8102E",
        width: "175px",
        height: "50px",
        fontSize: "22px",
      }}
    >
      Delete Product
    </button>
  </div>
)}

{!showConfirmation && validationMessage && (
  <p className="text-danger">{validationMessage}</p>
)}



    </div>
  );
};

export default DeleteProduct;