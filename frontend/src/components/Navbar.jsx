import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar({ modules = [] }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="navbar">
      <div className="nav-left">
        <Link className="buttons" to="/">
          Home
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* LINKS */}
      <div className={menuOpen ? "nav-links open" : "nav-links"}>
        {names.includes("blog") && <Link className="buttons" to="/blog">Blog</Link>}
        {names.includes("gallery") && <Link className="buttons" to="/gallery">Gallery</Link>}
        {names.includes("contact") && <Link className="buttons" to="/contact">Contact</Link>}

        {!token ? (
          <>
            <Link className="buttons login" to="/login">Login</Link>
            <Link className="buttons register" to="/register">Register</Link>
          </>
        ) : (
          <>
            {isAdmin && (
              <Link className="buttons" to="/admin">
                Admin Dashboard
              </Link>
            )}
            <Link className="buttons" to="/profile">Profile</Link>

            <button
              className="buttons logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
