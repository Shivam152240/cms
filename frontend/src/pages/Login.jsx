import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './login.css';

const API = "http://localhost:5000/api/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, form);

      // ✅ Save login info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAdmin", res.data.user.isAdmin); // 👈 Added line

      setMessage("Login successful!");
      navigate("/");
      window.location.reload(); // 👈 optional (to instantly refresh Navbar)
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: "50px auto" }}>
      <div className="login-box">
      <h2 >Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
        />
        <br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />
        <br /><br />
        <button type="submit">Login</button>
      </form>
      {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}
