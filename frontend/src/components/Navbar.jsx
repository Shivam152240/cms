import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './navbar.css';
export default function Navbar({ modules = [] }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Safe parse (string ya boolean dono handle karega)
  const isAdmin =
    localStorage.getItem("isAdmin") === "true" ||
    localStorage.getItem("isAdmin") === true;

  const names = modules.map((m) =>
    m && m.name ? String(m.name).trim().toLowerCase() : ""
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar " style={{ padding: 15, borderBottom: "1px solid #ddd" }}>
      <Link className="buttons" to="/" style={{ marginRight: 12 }}>Home</Link>

      {names.includes("blog") && (
        <Link className="buttons"to="/blog" style={{ marginRight: 12 }}>Blog</Link>
      )}
      {names.includes("gallery") && (
        <Link className="buttons" to="/gallery" style={{ marginRight: 12 }}>Gallery</Link>
      )}
      {names.includes("contact") && (
        <Link className="buttons"to="/contact" style={{ marginRight: 12 }}>Contact</Link>
      )}

      {/* Auth buttons */}
      <div style={{ float: "right" }}>
        {!token ? (
          <>
            <Link className="buttons"to="/login" style={{ marginRight: 12 }}>Login</Link>
            <Link className="buttons"to="/register" style={{ marginRight: 52 }}>Register</Link>
          </>
        ) : (
          <>
            {/* ✅ Admin dashboard only if isAdmin true */}
            {isAdmin && (
              <Link className="buttons"to="/admin" style={{ marginRight: 12 }}>
                Admin Dashboard
              </Link>
            )}
            <Link className="buttons"to="/profile" style={{ marginRight: 12 }}>Profile</Link>
            <button className="buttons "
              onClick={handleLogout}
              style={{
                background: "transparent",
                marginRight:50,
                border: "none",
                cursor: "pointer",
                color: "white",

              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
