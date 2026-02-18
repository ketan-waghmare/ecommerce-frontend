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

  // ✅ NEW - Image state
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  // ✅ NEW - Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!product.name || !product.price) {
      alert("Name and Price are required");
      return;
    }

    setLoading(true);
    setError('');

    // ✅ UPDATED - Use FormData instead of JSON
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    
    if (image) {
      formData.append('image', image);
    }

    // ✅ UPDATED - Pass FormData to addProduct
    addProduct(formData)
      .then(() => {
        alert("Product added successfully");
        setProduct({ name: "", description: "", price: "", stock: "" });
        setImage(null);
        setImagePreview(null);
        if (onProductAdded) onProductAdded(); // refresh list
      })
      .catch((error) => {
        console.error(error);
        setError(error.response?.data || 'Failed to add product');
        alert("Failed to add product");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container">

      <h2>Add Product</h2>

      {/* ✅ NEW - Error message */}
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* ✅ NEW - Image Upload Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Product Image
          </label>
          
          {imagePreview ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '300px', 
                  maxHeight: '300px', 
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 59, 48, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                style={{
                  display: 'inline-block',
                  padding: '40px 80px',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: '#fafafa',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.background = '#f0f4ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc';
                  e.target.style.background = '#fafafa';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                  Click to upload image
                </div>
                <small style={{ color: '#999' }}>Max 5MB • PNG, JPG, JPEG</small>
              </label>
            </div>
          )}
        </div>

        {/* Existing form fields */}
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

        {/* ✅ UPDATED - Show loading state */}
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;