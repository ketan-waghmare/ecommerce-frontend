import { useEffect, useState } from "react";
import {getCartWithCartId, getCartWithToken, removeFromCart } from "../services/cartService";
import { updateCartQuantity } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import './Cart.css';


function Cart({ refreshCart }) {
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = (id, qty) => {
    updateCartQuantity(id, qty)
      .then(res => {
        setItems(res.data.items);
        refreshCart();
      });
  };

  const removeItem = (id) => {
    removeFromCart(id)
      .then(() => {
        loadCart();
        refreshCart();
      });
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    console.log("Token value:", token);
    console.log("Token type:", typeof token);

    if (!token || token === "null" || token === "undefined") {
      navigate("/login?redirect=checkout");
      return;
    }

    navigate("/checkout");
  }

  //   const loadCart = () => {
  //     getCart().then((res) => setItems(res.data));
  //   };

  const loadCart = () => {
    // getCart().then(res => {
    //   // Make sure we always have an array
    //   const itemsArray = Array.isArray(res.data.items) ? res.data.items : [];
    //   setItems(itemsArray);
    // });

    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");

    if (token && token!== "null" && token !== "undefined") {
      // ✅ USER MODE
      getCartWithToken()
        .then(res => {
          const itemsArray = Array.isArray(res.data.items) ? res.data.items : [];
          setItems(itemsArray);
        })
        .catch(() => setItems([]));
    } else if (cartId) {
      // ✅ GUEST MODE
      getCartWithCartId(cartId)
        .then(res => {
          const itemsArray = Array.isArray(res.data.items) ? res.data.items : [];
          setItems(itemsArray);
        })
        .catch(() => setItems([]));
    } else {
      // ✅ NO CART YET
      setItems([]);
    }

  };

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity, 0
  )

  return (
    <div className="cart-page">
      <h2 className="cart-title">Shopping Cart</h2>

      <div className="cart-content">
        <div className="cart-items">
          {items.length === 0 && <p>Cart is empty</p>}

          {items.map(item => (
            <div key={item.id} className="cart-card">
              <div className="cart-info">
                <h4>{item.product.name}</h4>
                <p>₹{item.product.price}</p>
              </div>

              <div className="cart-actions">
                <div className="qty-box">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>


                <div className="item-total">
                  <p>Total: ₹{item.product.price * item.quantity}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {items.length > 0 && (
        <div className="cart-summary">
          <h3>Price Details</h3>
          <div className="summary-row">
            <span>Total Items</span>
            <span>{items.length}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
          <button className="checkout-btn" onClick={() => handleCheckout()}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
