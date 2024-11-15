// CartContext.js
import React, { createContext, useState, useContext, } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  // Fetch product details before adding to the cart
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:2000/catalog/id/${productId}`
      );
      const product = await response.json();
      return product;
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      return null;
    }
  };

  const addToCart = async (productId, quantity) => {
    const product = await fetchProductDetails(productId);
    if (product) {
      const newItem = {
        ...cart[productId],
        id: productId,
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price,
        quantity: (cart[productId]?.quantity || 0) + quantity,
      };
      const newCart = { ...cart, [productId]: newItem };
      setCart(newCart);
      
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = { ...cart };
    if (updatedCart[productId].quantity === 1) {
      delete updatedCart[productId];
    } else {
      updatedCart[productId].quantity -= 1;
    }
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
