import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './register.css';
import { Link } from "react-router-dom";

const API = "https://cms-xjfn.onrender.com/api/auth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false, // 👈 default false
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/register`, form);
      setMessage("Registration successful!");
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: 400, margin: "50px auto" }}>
            <div className="register-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* Admin checkbox hidden - always false */}

        <button type="submit">Register</button>
       <p className="p">already have an account?<Link to="/login"> Sign in</Link>  </p>
      </form>

      {message && <p className="register-message">{message}</p>}
    </div>
    </div>
  );
}
