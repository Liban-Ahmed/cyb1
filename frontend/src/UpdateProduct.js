import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UpdateProduct.css";

const UpdateProduct = () => {
  const [productId, setProductId] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    
  });
  const [validationMessage, setValidationMessage] = useState("");
  const [showInputs, setShowInputs] = useState(false); // State to control showing/hiding inputs
  const { _id, ...updateData } = formData; // Exclude _id field
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [firstNameConfirmation, setFirstNameConfirmation] = useState("");
  const [lastNameConfirmation, setLastNameConfirmation] = useState("");


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Convert price  to float if the field is "price""
    const updatedValue = (name === "price" ) ? parseFloat(value) : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
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
        setFormData(data);
        
        setValidationMessage("");
        setShowConfirmation(true);
        setShowInputs(false);
      })
      .catch((error) => {
        setValidationMessage("Product not found.");
        setShowInputs(false);
        setShowConfirmation(false);
        setFormData({
          id: "",
          firstname: "",
          lastname: "",
          email: "",
          title: "",
          price: "",
          description: "",
          category: "",
          image: "",
          
        });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to update this product?");

    fetch(`http://127.0.0.1:2000/catalog/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update product");
        }
        return response.json();
      })
      .then((data) => {
        setValidationMessage("Product updated successfully!");
      })
      .catch((error) => {
        setValidationMessage("Failed to update product. Please try again.");
      });
  };

  const handleConfirm = () => {
    // Check if first and last names are not empty
    if (firstNameConfirmation.trim() !== "" && lastNameConfirmation.trim() !== "") {
      // Check if the entered first and last names match the stored data
      if (
        firstNameConfirmation.trim() === formData.firstname &&
        lastNameConfirmation.trim() === formData.lastname
      ) {
        setShowInputs(true); // Show the product form
        setValidationMessage(""); // Clear any existing validation message
        setShowConfirmation(false);
      } else {
        setValidationMessage("First and last names do not match."); // Display validation message
      }
    } else {
      // If either first or last name is empty, show validation message
      setValidationMessage("Please enter both first and last names.");
    }
  };
  
  
  

  return (
    <div className="container" style={{ height: "1500px" }}>
      <div className="red-container">
        <h2>Update Product</h2>
      </div>
      {validationMessage && (
        <p className="text-danger">{validationMessage}</p>
      )}
      <div className="mb-3">
        <label htmlFor="productId" className="form-label">
          Product ID:
        </label>
        <input
          type="text"
          className="form-control"
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
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
                value={firstNameConfirmation}
                onChange={(e) => setFirstNameConfirmation(e.target.value)}
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
                value={lastNameConfirmation}
                onChange={(e) => setLastNameConfirmation(e.target.value)}
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
        </div>
      )}
      {showInputs && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div className="mb-3">
            <input type="hidden" name="id" value={formData.id} />
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firstname" className="form-label">
                  First Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="lastname" className="form-label">
                  Last Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <label htmlFor="title" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price:
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category:
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Image URL:
            </label>
            <input
              type="text"
              className="form-control"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              backgroundColor: "#C8102E",
              width: "200px",
              height: "50px",
              fontSize: "24px",
              fontFamily: "Impact, sans-serif",
            }}
          >
            Update Product
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateProduct;
