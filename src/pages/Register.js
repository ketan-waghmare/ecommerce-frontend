import React, { useState } from "react";
import { registerUser } from "../services/userService";
import "./AddProduct.css";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    registerUser(user).then(() => {
      alert("Registration successful");
    });
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
         <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
