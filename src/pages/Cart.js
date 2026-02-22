import { useEffect, useState } from "react";
import { getCartWithCartId, getCartWithToken, removeFromCart } from "../services/cartService";
import { updateCartQuantity } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import './Cart.css';

function Cart({ refreshCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = (id, qty) => {
    if (qty < 1) return; // Prevent negative quantities
    
    updateCartQuantity(id, qty)
      .then(res => {
        setItems(res.data.items);
        refreshCart();
      })
      .catch(err => {
        console.error('Failed to update quantity:', err);
      });
  };

  const removeItem = (id) => {
    removeFromCart(id)
      .then(() => {
        loadCart();
        refreshCart();
      })
      .catch(err => {
        console.error('Failed to remove item:', err);
      });
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") {
      navigate("/login?redirect=checkout");
      return;
    }

    navigate("/checkout");
  }

  const loadCart = () => {
    setLoading(true);
    
    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");

    if (token && token !== "null" && token !== "undefined") {
      // ✅ USER MODE
      getCartWithToken()
        .then(res => {
          const itemsArray = Array.isArray(res.data.items) ? res.data.items : [];
          setItems(itemsArray);
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else if (cartId) {
      // ✅ GUEST MODE
      getCartWithCartId(cartId)
        .then(res => {
          const itemsArray = Array.isArray(res.data.items) ? res.data.items : [];
          setItems(itemsArray);
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      // ✅ NO CART YET
      setItems([]);
      setLoading(false);
    }
  };

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity, 0
  );

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        
        {/* Left Side - Cart Items */}
        <div className="cart-left">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <span className="item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>

          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to get started!</p>
              <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  
                  {/* Product Image */}
                  <div className="item-image">
                    {item.product?.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} />
                    ) : (
                      <div className="image-placeholder">📦</div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="item-details">
                    <h3 className="item-name">{item.product.name}</h3>
                    <p className="item-description">{item.product.description}</p>
                    <div className="item-price-mobile">₹{item.product.price.toLocaleString()}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="item-quantity">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="item-price">
                    ₹{item.product.price.toLocaleString()}
                  </div>

                  {/* Subtotal */}
                  <div className="item-subtotal">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove Button */}
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Cart Summary */}
        {items.length > 0 && (
          <div className="cart-right">
            <div className="cart-summary">
              <h2 className="summary-title">Price Details</h2>

              <div className="summary-row">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className="free-tag">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="savings-info">
                🎉 You will save delivery charges on this order
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                <span>Proceed to Checkout</span>
                <span className="checkout-arrow">→</span>
              </button>

              <button className="continue-btn" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;