import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Catalog.css"; // Import your CSS file for Catalog styling
import { useCart } from "../Cart/CartContext";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [searched, setSearched] = useState(false);
  const [sortByPriceAscending, setSortByPriceAscending] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track the selected product
  const productCount = searched ? searchedProducts.length : products.length;
  const { addToCart } = useCart();
  // Fetch all products initially
  useEffect(() => {
    // Fetch all products initially only if products haven't been fetched yet
    if (products.length === 0) {
      fetch("http://127.0.0.1:2000/catalog")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error("Error retrieving products:", error);
          setProducts([]);
        });
    }
  }, [products]);

  const handleSearchProduct = () => {
    // Ensure category is not empty before making the fetch request
    if (category.trim() !== "") {
      fetch(`http://127.0.0.1:2000/catalog/category/${category}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Products not found for this category");
          }
          return response.json();
        })
        .then((data) => {
          setSearchedProducts(data);
          setSearched(true);
        })
        .catch((error) => {
          console.error("Error retrieving products:", error);
          // Handle the error gracefully
          setSearchedProducts([]);
          setSearched(true);
        });
    } else {
      // If category is empty, fetch all products
      setSearchedProducts([]);
      setSearched(false);
    }
  };

  // Function to handle showing all products
  const handleShowAllProducts = () => {
    setCategory(""); // Reset category
    setSearchedProducts([]); // Clear searched products
    setSearched(false); // Reset search state
    setSelectedProduct(null); // Clear selected product when showing all products
  };

  const handleViewItem = (productId) => {
    // Find the selected product based on productId
    const selected = searched
      ? searchedProducts.find((product) => product.id === productId)
      : products.find((product) => product.id === productId);
    setSelectedProduct(selected);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const sortByPrice = () => {
    // Determine which array to sort based on the search state
    const productsToSort = searched
      ? searchedProducts.slice()
      : products.slice();

    // Sort the products by price
    const sortedProducts = productsToSort.sort((a, b) =>
      sortByPriceAscending ? a.price - b.price : b.price - a.price
    );

    // Update the state with the sorted products
    setSearchedProducts(searched ? sortedProducts : []);
    setProducts(!searched ? sortedProducts : []);
    setSortByPriceAscending(!sortByPriceAscending);
  };

  const handleAddToCart = (product) => {
    addToCart(product.id, 1); // Add 1 quantity of the product
    alert(`${product.title} added to cart!`); // Optional feedback
  };

  return (
    <div className="container-fluid" style={{ background: "#F1BE48" }}>
      {/* Search bar container */}
      <div
        className="search-bar-container mb-4 d-flex justify-content-between align-items-center"
        style={{
          background:
            "linear-gradient(135deg, #C8102E, #C8102E 50%, #F1BE48 50%, #F1BE48)",
        }}
      >
        <div className="search-input-container">
          <label
            htmlFor="category"
            className="form-label custom-label"
            style={{
              padding: "5px 10px",
              fontSize: "24px",
              fontFamily: "Impact, sans-serif",
              backgroundColor: "#F1BE48",
            }}
          >
            Search by Category:
          </label>
          <input
            type="text"
            id="category"
            className="form-control"
            value={category}
            onChange={handleCategoryChange} // Attach onChange event handler
            placeholder="Search Category"
          />
          <div className="search-button-container">
            <button
              onClick={handleSearchProduct}
              className="btn btn-primary custom-search-button"
              style={{
                padding: "5px 10px",
                fontSize: "18px",
                fontFamily: "Impact, sans-serif",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Sorting button */}
        <div className="sorting-buttons">
          <button
            onClick={sortByPrice}
            className="btn btn-primary me-2"
            style={{
              backgroundColor: "#C8102E",
              padding: "5px 10px",
              fontSize: "18px",
              fontFamily: "Impact, sans-serif",
            }}
          >
            {sortByPriceAscending
              ? "Sort by Price (Low to High)"
              : "Sort by Price (High to Low)"}
          </button>
        </div>
      </div>

      {/* Button to show all products */}
      {searched && (
        <button
          onClick={handleShowAllProducts}
          className="btn btn-secondary mb-4"
          style={{ backgroundColor: "#C8102E", marginLeft: "11px" }}
        >
          Show All Products
        </button>
      )}

      {/* Product count */}
      <p className="text-muted mb-3">Showing {productCount} product(s)</p>

      {/* Display the searched products or the full catalog */}
      {selectedProduct ? (
        // Display details of the selected product
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="container"
            style={{
              maxWidth: "80%",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div style={{ flex: "1", marginRight: "20px" }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{
                  maxWidth: "400px",
                  height: "auto",
                  marginBottom: "20px",
                  borderRadius: "10px",
                }}
              />
            </div>
            <div
              style={{ flex: "1", display: "flex", flexDirection: "column" }}
            >
              <div>
                <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>
                  Product Details
                </h2>
                <h3
                  style={{
                    fontSize: "30px",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedProduct.title}
                </h3>
                <p style={{ fontSize: "24px", marginBottom: "10px" }}>
                  <strong>Category:</strong> {selectedProduct.category}
                </p>
                <p style={{ fontSize: "24px", marginBottom: "10px" }}>
                  <strong>Description:</strong> {selectedProduct.description}
                </p>
                <p style={{ fontSize: "24px", marginBottom: "10px" }}>
                  <strong>Price:</strong> {selectedProduct.price}
                </p>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: "#C8102E",
                    color: "white",
                    borderRadius: "10px",
                    marginRight: "10px",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  Back to Catalog
                </button>
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#C8102E",
                    color: "white",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Display catalog
        <div
          className="row row-cols-1 row-cols-md-3 g-4"
          style={{
            marginLeft: "15px",
            marginRight: "15px",
            background: "#F1BE48",
          }}
        >
          {(searched ? searchedProducts : products).map((product, index) => (
            <div key={`${product.id}_${index}`} className="col">
              <div className="card h-100">
                <div
                  className="image-container"
                  style={{ backgroundColor: "white" }}
                >
                  <img
                    src={product.image}
                    className="card-img-top mx-auto"
                    alt="product"
                    style={{ maxWidth: "200px", objectFit: "cover" }}
                  />
                </div>
                <div className="card-body" style={{ position: "relative" }}>
                  <h5
                    className="card-title text-center mb-3"
                    style={{ fontSize: "30px" }}
                  >
                    {product.title}
                  </h5>
                  <div className="mb-3 d-flex flex-column">
                    <div
                      className="card-text mb-auto"
                      style={{ fontSize: "20px" }}
                    >
                      Category: {product.category}
                    </div>
                    <div
                      className="card-text"
                      style={{
                        fontSize: "24px",
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                      }}
                    >
                      Price: {product.price}
                    </div>
                  </div>

                  {/* Add the Add to Cart and View Item buttons */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary add-to-cart-btn"
                    style={{
                      backgroundColor: "#F1BE48",
                      position: "absolute",
                      bottom: 10,
                      right: 105,
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleViewItem(product.id)}
                    className="btn btn-primary view-item-btn"
                    style={{
                      backgroundColor: "#F1BE48",
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                    }}
                  >
                    View Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
