import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProductById } from "../services/productService";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/cartService";

function ProductList({ refreshCart }) {

  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    getAllProducts()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteProductById(id).then(loadProducts);
    }
  };

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Product List</h2>

      {message && (
        <div className="success-message">
          ✅ {message}
        </div>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            
            {/* ✅ NEW - Product Image */}
            <div className="product-image-container">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              ) : (
                <div className="product-image-placeholder">
                  <span className="placeholder-icon">📷</span>
                  <p className="placeholder-text">No Image</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h3>{p.name}</h3>
              <p className="product-description">{p.description}</p>
              <p className="price">₹{p.price}</p>

              {/* ✅ NEW - Stock indicator */}
              {p.stock > 0 ? (
                <p className="stock-info in-stock">✓ In Stock ({p.stock})</p>
              ) : (
                <p className="stock-info out-of-stock">✗ Out of Stock</p>
              )}

              {/* Action Buttons */}
              <div className="product-actions">
                {isAdmin && (
                  <button onClick={() => deleteProduct(p.id)} className="delete-btn">
                    Delete
                  </button>
                )}

                {isAdmin && (
                  <button onClick={() => navigate(`/edit-product/${p.id}`)} className="edit-btn">
                    Edit
                  </button>
                )}

                <button 
                  onClick={() => addToCart(p.id).then(() => {
                    refreshCart();
                    setMessage(`${p.name} added to cart`);
                    setTimeout(() => setMessage(""), 3000);
                  })}
                  className="add-to-cart-btn"
                  disabled={p.stock === 0}
                >
                  {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products available</h3>
          <p>Check back later or add a new product!</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;