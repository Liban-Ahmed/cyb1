import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Catalog.css";
import { useCart } from "../Cart/CartContext";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [searched, setSearched] = useState(false);
  const [sortByPriceAscending, setSortByPriceAscending] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productCount = searched ? searchedProducts.length : products.length;
  const { addToCart } = useCart();

  useEffect(() => {
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
          setSearchedProducts([]);
          setSearched(true);
        });
    } else {
      setSearchedProducts([]);
      setSearched(false);
    }
  };

  const handleShowAllProducts = () => {
    setCategory("");
    setSearchedProducts([]);
    setSearched(false);
    setSelectedProduct(null);
  };

  const handleViewItem = (productId) => {
    const selected = searched
      ? searchedProducts.find((product) => product.id === productId)
      : products.find((product) => product.id === productId);
    setSelectedProduct(selected);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const sortByPrice = () => {
    const productsToSort = searched
      ? searchedProducts.slice()
      : products.slice();
    const sortedProducts = productsToSort.sort((a, b) =>
      sortByPriceAscending ? a.price - b.price : b.price - a.price
    );
    setSearchedProducts(searched ? sortedProducts : []);
    setProducts(!searched ? sortedProducts : []);
    setSortByPriceAscending(!sortByPriceAscending);
  };

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="container-fluid catalog-container">
      <div className="search-bar-container mb-4 d-flex justify-content-between align-items-center">
        <div className="search-input-container">
          <label htmlFor="category" className="form-label custom-label">
            Search by Category:
          </label>
          <input
            type="text"
            id="category"
            className="form-control"
            value={category}
            onChange={handleCategoryChange}
            placeholder="Search Category"
          />
          <div className="search-button-container">
            <button
              onClick={handleSearchProduct}
              className="btn btn-primary custom-search-button"
            >
              Search
            </button>
          </div>
        </div>

        <div className="sorting-buttons">
          <button onClick={sortByPrice} className="btn btn-primary sort-button">
            {sortByPriceAscending
              ? "Sort by Price (Low to High)"
              : "Sort by Price (High to Low)"}
          </button>
        </div>
      </div>

      {searched && (
        <button
          onClick={handleShowAllProducts}
          className="btn btn-secondary show-all-products-btn"
        >
          Show All Products
        </button>
      )}

      <p className="text-muted mb-3">Showing {productCount} product(s)</p>

      {selectedProduct ? (
        <div className="selected-product-container">
          <div className="selected-product">
            <div className="selected-product-image">
              <img src={selectedProduct.image} alt={selectedProduct.title} />
            </div>
            <div className="selected-product-details">
              <h2>Product Details</h2>
              <h3>{selectedProduct.title}</h3>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
              <p>
                <strong>Price:</strong> {selectedProduct.price}
              </p>
              <div className="selected-product-actions">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="btn btn-secondary"
                >
                  Back to Catalog
                </button>
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="btn btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 product-catalog">
          {(searched ? searchedProducts : products).map((product, index) => (
            <div key={`${product.id}_${index}`} className="col">
              <div className="card h-100 product-card">
                <div className="image-container">
                  <img
                    src={product.image}
                    className="card-img-top mx-auto"
                    alt="product"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <div className="mb-3 d-flex flex-column">
                    <div className="card-text">
                      Category: {product.category}
                    </div>
                    <div className="card-text price-text">
                      Price: {product.price}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleViewItem(product.id)}
                    className="btn btn-primary view-item-btn"
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
