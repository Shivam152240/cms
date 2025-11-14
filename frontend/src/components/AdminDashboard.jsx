import React, { useEffect, useState } from "react";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  // Fetch user-specific blogs & gallery
  const fetchUserDetails = async (userId) => {
    setSelectedUser(userId);
    const [blogsRes, galleryRes] = await Promise.all([
      fetch(`http://localhost:5000/api/admin/users/${userId}/blogs`),
      fetch(`http://localhost:5000/api/admin/users/${userId}/gallery`),
      
    ]);
    setBlogs(await blogsRes.json());
    setGallery(await galleryRes.json());
  };

  // Delete functions
  const deleteBlog = async (id) => {
    await fetch(`http://localhost:5000/api/admin/blogs/${id}`, { method: "DELETE" });
    setBlogs(blogs.filter((b) => b._id !== id));
  };

  const deleteImage = async (id) => {
    await fetch(`http://localhost:5000/api/admin/gallery/${id}`, { method: "DELETE" });
    setGallery(gallery.filter((g) => g._id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Manage users, blogs, and gallery uploads</p>

      <div className="dashboard-layout">
        <div className="users-section">
          <h2>All Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                className={selectedUser === user._id ? "active" : ""}
                onClick={() => fetchUserDetails(user._id)}
              >
                <span>{user.username}</span>
                <span className="email">{user.email}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="details-section">
          {selectedUser ? (
            <>
              <h2>User Blogs</h2>
              <div className="blogs-list">
                {blogs.length ? (
                  blogs.map((blog) => (
                    <div className="blog-card" key={blog._id}>
                      <h4>{blog.title}</h4>
                      <p>{blog.body}</p>
                      <button onClick={() => deleteBlog(blog._id)}>Delete</button>
                    </div>
                  ))
                ) : (
                  <p>No blogs found.</p>
                )}
              </div>

              <h2>User Gallery</h2>
              <div className="gallery-list">
                {gallery.length ? (
                  gallery.map((img) => (
                    <div className="gallery-item" key={img._id}>
                      <img src={`http://localhost:5000${img.url}`} alt="" />
                      <button onClick={() => deleteImage(img._id)}>Delete</button>
                    </div>
                  ))
                ) : (
                  <p>No images found.</p>
                )}
              </div>
            </>
          ) : (
            <p>Select a user to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
