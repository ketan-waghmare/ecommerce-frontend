import { useEffect, useState } from "react";
import { getCartWithCartId, getCartWithToken } from "../services/cartService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout({ refreshCart }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingPhone: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");

    if (token && token !== "null" && token !== "undefined") {
      // ✅ USER MODE
      getCartWithToken()
        .then(res => {
          setCart(res.data);
        })
        .catch(() => setCart([]));
    } else if (cartId) {
      // ✅ GUEST MODE
      getCartWithCartId(cartId)
        .then(res => {
          setCart(res.data);
        })
        .catch(() => setCart([]));
    } else {
      // ✅ NO CART YET
      setCart([]);
    }
  }, []);

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const placeOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    axios.post(
      `http://localhost:8080/api/orders/place`,
      shippingInfo,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => {
        console.log('✅ Order placed:', res.data);
        localStorage.removeItem('cartId');
        refreshCart();
        navigate("/order-success", { state: res.data });
      })
      .catch(err => {
        console.error('❌ Order failed:', err);
        setError(err.response?.data || 'Failed to place order');
        alert(err.response?.data || 'Failed to place order');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!cart) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">
          <div className="loading-spinner"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">

        {/* Left Side - Shipping Form */}
        <div className="checkout-left">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <p className="checkout-subtitle">Complete your order</p>
          </div>

          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={placeOrder} className="shipping-form">
            
            {/* Shipping Address Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">📍</span>
                Delivery Address
              </h2>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={shippingInfo.shippingAddress}
                  onChange={handleChange}
                  placeholder="House no., Building name, Street"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="shippingCity"
                    value={shippingInfo.shippingCity}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="shippingState"
                    value={shippingInfo.shippingState}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="shippingZip"
                    value={shippingInfo.shippingZip}
                    onChange={handleChange}
                    placeholder="e.g. 400001"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="shippingPhone"
                    value={shippingInfo.shippingPhone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">💳</span>
                Payment Method
              </h2>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={shippingInfo.paymentMethod === 'COD'}
                    onChange={handleChange}
                  />
                  <div className="payment-option-content">
                    <span className="payment-icon">💵</span>
                    <div>
                      <div className="payment-title">Cash on Delivery</div>
                      <div className="payment-desc">Pay when you receive</div>
                    </div>
                  </div>
                  <span className="radio-checkmark"></span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={shippingInfo.paymentMethod === 'CARD'}
                    onChange={handleChange}
                  />
                  <div className="payment-option-content">
                    <span className="payment-icon">💳</span>
                    <div>
                      <div className="payment-title">Credit/Debit Card</div>
                      <div className="payment-desc">Visa, Mastercard, Rupay</div>
                    </div>
                  </div>
                  <span className="radio-checkmark"></span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={shippingInfo.paymentMethod === 'UPI'}
                    onChange={handleChange}
                  />
                  <div className="payment-option-content">
                    <span className="payment-icon">📱</span>
                    <div>
                      <div className="payment-title">UPI</div>
                      <div className="payment-desc">Google Pay, PhonePe, Paytm</div>
                    </div>
                  </div>
                  <span className="radio-checkmark"></span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="WALLET"
                    checked={shippingInfo.paymentMethod === 'WALLET'}
                    onChange={handleChange}
                  />
                  <div className="payment-option-content">
                    <span className="payment-icon">👛</span>
                    <div>
                      <div className="payment-title">Wallet</div>
                      <div className="payment-desc">Amazon Pay, Paytm Wallet</div>
                    </div>
                  </div>
                  <span className="radio-checkmark"></span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span>🛒</span>
                  Place Order
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div className="checkout-right">
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-items">
              {cart?.items?.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-image">
                    {item.product?.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} />
                    ) : (
                      <div className="item-placeholder">📦</div>
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.product?.name}</div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">
                    ₹{(item.product?.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal ({cart?.items?.length || 0} items)</span>
              <span>₹{cart.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className="free-delivery">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{cart.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toLocaleString()}</span>
            </div>

            <div className="savings-badge">
              🎉 You're saving delivery charges!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;