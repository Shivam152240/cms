import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

const API = "https://cms-xjfn.onrender.com/api/auth/profile";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first");
          return;
        }

        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <h2>Profile</h2>
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <img
          src={`https://ui-avatars.com/api/?name=${user.name}&background=007bff&color=fff`}
          alt="avatar"
          className="profile-avatar"
        />
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}</p>
      </div>
    </div>
  );
}
