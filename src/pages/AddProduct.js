import React, { useState } from "react";
import { addProduct } from "../services/productService";
import "./AddProduct.css";

function AddProduct({ onProductAdded }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!product.name || !product.price) {
      alert("Name and Price are required");
      return;
    }

    addProduct(product)
      .then(() => {
        alert("Product added successfully");
        setProduct({ name: "", description: "", price: "", stock: "" });
        onProductAdded(); // refresh list
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to add product");
      });
  };

  return (
   <div className="form-container">

      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
