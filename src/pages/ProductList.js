import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProductById } from "../services/productService";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/cartService";

function ProductList({ refreshCart }) {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    getAllProducts().then((res) => setProducts(res.data));
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteProductById(id).then(loadProducts);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Product List</h2>

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p className="price">₹{p.price}</p>

            <button onClick={() => deleteProduct(p.id)} className="delete-btn">
              Delete
            </button>

            <button onClick={() => navigate(`/edit-product/${p.id}`)}>
              Edit
            </button>

            <button onClick={() => addToCart(p.id).then(() => {
              refreshCart();
              setMessage(`${p.name} added to cart`)
            })}>
              Add to Cart
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
