import React, { useState } from "react";
import { loginUser } from "../services/userService";
import { mergeCart } from "../services/cartService";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddProduct.css";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const routerLocation = useLocation(); // ✅ rename

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await loginUser(data);
      alert("Login successful");
      console.log(res.data); // user data
      localStorage.setItem("token", res.data.token);

      const guestCartId = localStorage.getItem("cartId");

      // 🔥 MERGE CART AFTER LOGIN
      if (guestCartId) {
        await mergeCart(guestCartId);
        // localStorage.removeItem("cartId");
      }

      // 🔥 REDIRECT LOGIC
      const params = new URLSearchParams(routerLocation.search);
      const redirect = params.get("redirect");

      navigate(redirect === "checkout" ? "/checkout" : "/");

    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }



  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
