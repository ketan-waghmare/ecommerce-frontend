import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount }) {
  const token = localStorage.getItem("token");
  const isLoggedIn = token && token !== "null" && token !== "undefined";
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const isAdmin = role === "ADMIN";

  const logout = () => {
    // 🔥 Remove only token
    localStorage.removeItem("token");
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <h2>K&M Boutique</h2>
      <div>
        <Link to="/">Products</Link>

        {isAdmin && (
          <Link to="/add-product">Add Product</Link>
        )}

        {/* 🔥 AUTH LINKS */}
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
         // <Link className="logout-btn" onClick={logout}>Logout</Link>
         <>
            <span style={{ color: 'white', fontSize: '14px' }}>
              👋 {name}
            </span>
            {/* ✅ button instead of Link */}
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}


        {/* ✅ Show My Orders ONLY when logged in */}
        {isLoggedIn && (
          <Link to="/orders">My Orders 📦</Link>
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
