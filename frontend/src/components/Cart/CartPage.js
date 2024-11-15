import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import "./CartPage.css"; // Assuming you have a separate CSS file for cart styling

const CheckoutPage = ({ setCheckoutVisible, subtotal, total }) => {
  const [order, setOrder] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    zip: "",
    state: "",
    card: "7777-7777-7777-7777",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexZip = /^[0-9]{5}(?:-[0-9]{4})?$/;
    const regexCard = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

    if (!regexEmail.test(order.email)) newErrors.email = "Invalid email format";
    if (!order.firstName) newErrors.firstName = "First name is required";
    if (!order.lastName) newErrors.lastName = "Last name is required";
    if (!order.address) newErrors.address = "Address is required";
    if (!order.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!regexZip.test(order.zip)) newErrors.zip = "Invalid ZIP code";
    if (order.state === "Choose" || !order.state)
      newErrors.state = "State is required";
    if (!regexCard.test(order.card)) newErrors.card = "Invalid card format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Order submitted:", order);
      alert("Order has been submitted successfully!");
      setCheckoutVisible(false); // Optionally navigate away or close the modal
    } else {
      alert("Please correct the errors before submitting.");
    }
  };

  return (
    <div className="checkout-container" style={{ backgroundColor: "#F1BE48" }}>
      <form className="form-section container" onSubmit={handleSubmit}>
        {/* Input fields */}
        {Object.keys(order).map((key) => (
          <div key={key}>
            <input
              className={`input-field ${errors[key] ? "is-invalid" : ""}`}
              type={key === "card" || key === "zip" ? "text" : key}
              name={key}
              value={order[key]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            />
            {errors[key] && <div className="error">{errors[key]}</div>}
          </div>
        ))}
        <button type="submit" className="save-button">
          Save & Continue
        </button>
      </form>
      <div className="summary-section">
        <h3>In Your Bag</h3>
        <p className="summary-item">Subtotal: ${subtotal}</p>
        <p className="summary-item">Estimated Shipping: $8.00</p>
        <p className="summary-item">Estimated Tax: -</p>
        <p className="summary-item ">Total: ${total}</p>
        <button
          onClick={() => setCheckoutVisible(false)}
          className="checkout-button"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const [productsDetails, setProductsDetails] = useState({});
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false); // State to toggle checkout page visibility
  

  useEffect(() => {
    const fetchProductDetails = async () => {
      const products = await Promise.all(
        Object.entries(cart).map(async ([id, item]) => {
          const response = await fetch(
            `http://localhost:2000/catalog/id/${id}`
          );
          const product = await response.json();
          return { ...product, quantity: item.quantity };
        })
      );
      setProductsDetails(
        products.reduce(
          (acc, product) => ({ ...acc, [product.id]: product }),
          {}
        )
      );
      const totalPrice = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      setTotal(totalPrice);
    };

    fetchProductDetails();
  }, [cart]);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  if (showCheckout) {
    return (
      <CheckoutPage
        setCheckoutVisible={setShowCheckout}
        subtotal={total.toFixed(2)}
        total={(total + 8).toFixed(2)} // Assuming shipping and taxes calculated elsewhere
      />
    );
  }

  return (
    <div className="cart-container" style={{ backgroundColor: "#F1BE48"}}>
      <div><h2 style={{ color: "black" }}>Cart:</h2></div>
      <div className="cart-items"style={{marginTop:"50px"}}>
      {Object.values(productsDetails).map((product) => (
  <div key={product.id} className="cart-item">
    <div className="cart-item-image-container" style={{borderRadius:"10px"}}>
      <img
        src={product.image}
        alt={product.title}
        className="cart-item-image"
        style={{borderRadius:"10px"}}
      />
    </div>
    <div className="cart-item-details">
      <div className="cart-item-header"style={{fontWeight: "bold"}}>
        <h3>{product.title}</h3>
       
      </div>
      <p className="cart-item-category">{product.category}</p>
      <div className="cart-item-quantity">
      <span>Quantity: {product.quantity}</span>
        <button onClick={() => removeFromCart(product.id)} className="quantity-button" style={{fontSize:"30px"}}>
          -
        </button>
        
        
      </div>
    </div>
    <div className="cart-item-price">
      <p>${(product.price * product.quantity).toFixed(2)}</p>
    </div>
  </div>
))}


      </div>
      <div className="cart-summary">
        <h3>Summary</h3>
        <div className="summary-detail">Subtotal: ${total.toFixed(2)}</div>
        <div className="summary-detail">
          Estimated Shipping & Handling: $8.00
        </div>
        <div className="summary-detail">Estimated Tax: -</div>
        <div className="summary-total">Total: ${(total + 8).toFixed(2)}</div>
        <button onClick={handleCheckout} className="checkout-button">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
