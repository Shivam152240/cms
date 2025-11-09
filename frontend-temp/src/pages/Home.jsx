import React from "react";
import "./home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to Modular CMS</h1>
        <p>Manage your content with ease — simple, modular, and flexible.</p>
        <button className="home-btn">Explore Modules</button>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>📰 Blog Management</h3>
          <p>Create, edit, and publish articles with an easy-to-use interface.</p>
        </div>
        <div className="feature-card">
          <h3>🖼️ Media Gallery</h3>
          <p>Upload and organize images in one central place.</p>
        </div>
        <div className="feature-card">
          <h3>👤 User Profiles</h3>
          <p>Manage users, their profiles, and access levels effortlessly.</p>
        </div>
      </div>
    </div>
  );
}
