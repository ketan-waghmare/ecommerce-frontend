import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="order-success-container">
      <div className="success-card">
        <h1>🎉 Order Placed Successfully!</h1>
        <p>Thank you for shopping with us.</p>

        <Link to="/" className="continue-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
