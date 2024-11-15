import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddProduct.css";

const AddProduct = () => {
  // Define state for form fields and validation message
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

  // Function to handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const confirmAdd = window.confirm("Are you sure you want to add this product?");
    if (!confirmAdd) {
      // User canceled the add product action
      return;
    }

    // Convert id, price,to numbers
    const formattedData = {
      ...formData,
      id: parseInt(formData.id),
      price: parseFloat(formData.price),
      
    };

    // Check if all fields are filled
    for (const key in formattedData) {
      if (!formattedData[key]) {
        setValidationMessage("Please fill in all fields.");
        return;
      }
    }

    // Perform form submission logic here
    fetch("http://127.0.0.1:2000/catalog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add product");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Product added successfully:", data);
        // Clear form fields after successful submission
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
        setValidationMessage("Product added successfully!");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        // Handle error
        setValidationMessage("Failed to add product. Please try again.");
      });
  };

  return (
    <div className="container" style={{ backgroundColor: "#F1BE48", marginBottom: '5px' }}>
      <div class="red-container" >
        <h2>Add Product</h2>
      </div>
      {/* Display validation message */}
      {validationMessage && <p className="text-danger">{validationMessage}</p>}
      <form onSubmit={handleSubmit}>
        {/* ID */}
        <div className="mb-3">
          <label htmlFor="id" className="form-label">
            ID:
          </label>
          <input
            type="text"
            className="form-control"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
          />
        </div>
        {/* Firstname */}
        <div className="mb-3">
  <div className="row">
    <div className="col">
      <label htmlFor="firstname" className="form-label">
        Firstname:
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
        Lastname:
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
</div>

        {/* Email */}
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
        {/* Title */}
        <div className="mb-3">
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
        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input
            type="text"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
        {/* Description */}
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
        {/* Category */}
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
        {/* Image */}
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
        

        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#C8102E", width: "100px", height: "50px", fontSize: "24px", fontFamily: "Impact, sans-serif" }}>
        Submit
      </button>
      </form>
    </div>
  );
};

export default AddProduct;
