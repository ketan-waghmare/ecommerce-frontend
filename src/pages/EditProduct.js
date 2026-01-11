import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import "./AddProduct.css"; // reuse same styling

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });

  useEffect(() => {
    getProductById(id).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProduct(id, product).then(() => {
      alert("Product updated");
      navigate("/");
    });
  };

  return (
    <div className="form-container">
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" value={product.name} onChange={handleChange} />
        <input name="description" value={product.description} onChange={handleChange} />
        <input name="price" type="number" value={product.price} onChange={handleChange} />
        <input name="stock" type="number" value={product.stock} onChange={handleChange} />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;
