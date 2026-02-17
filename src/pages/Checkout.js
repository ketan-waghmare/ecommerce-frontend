import { useEffect, useState } from "react";
import { getCartWithCartId, getCartWithToken } from "../services/cartService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout({ refreshCart }) {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // getCart().then(res => setCart(res.data));

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

  const [shippingInfo, setShippingInfo] = useState({
    shippingAddress: 'suguna apt',
    shippingCity: 'HYD',
    shippingState: 'telangana',
    shippingZip: '500016',
    shippingPhone: '123456789',
    paymentMethod: 'COD'
});

  const placeOrder = () => {
    axios.post(
      `http://localhost:8080/api/orders/place`,
      shippingInfo,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }

    )
      .then(res => {
        console.log('✅ Order placed:', res.data);
        localStorage.removeItem('cartId');  // Clear cartId after order
        refreshCart();
        navigate("/order-success", { state: res.data });
      })

      .catch(err => {
          console.error('❌ Order failed:', err);
          alert(err.response?.data || 'Failed to place order');
      });
  };

  if (!cart) return <p>Loading...</p>;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {cart.items.map(item => (
        <div key={item.id} className="checkout-item">
          <span>{item.product.name}</span>
          <span>{item.quantity} × ₹{item.product.price}</span>
        </div>
      ))}

      <h3>Total: ₹{cart.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity, 0
      )}</h3>

      <button className="checkout-btn" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
