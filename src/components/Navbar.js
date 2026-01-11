import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount }) {
  const token = localStorage.getItem("token");
  const isLoggedIn =
    token && token !== "null" && token !== "undefined";
  const logout = () => {
    // 🔥 Remove only token
    localStorage.removeItem("token");

    localStorage.clear();

    // ❌ Do NOT remove cartId
    // Guest cart should continue

    // 🔥 Hard reload to reset state & security context
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <h2>E-Commerce</h2>
      <div>
        <Link to="/">Products</Link>
        <Link to="/add-product">Add Product</Link>


        {/* <Link to="/login">Login</Link>
        <Link to="/register">Register</Link> */}


        {/* 🔥 AUTH LINKS */}
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}


        {/* 🔥 NEW CART LINK */}
        <Link to="/cart">
          Cart 🛒 <span className="cart-badge">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
