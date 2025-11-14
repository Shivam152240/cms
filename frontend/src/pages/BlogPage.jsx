import React, { useEffect, useState } from "react";
import './blogPage.css';



const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const addBlog = async () => {
    if (!user || !(user._id || user.id)) {
      return alert("Please signup first");
    }
    if (!title || !content) return alert("Title and content required");
    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          title, 
          content,
          authorId: user?.id || user?._id || null,
          authorname: user?.name || 'Anonymous'
        }),
      });
      const newBlog = await res.json();
      setBlogs([newBlog, ...blogs]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete blog');
      }
      
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error deleting blog');
    }
  };

  return (
    <div className="  flex flex-col items-center p-6 blog-page">
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-6 tracking-wide drop-shadow-md headline">
        📝 Manage Blog Posts
      </h1>

      {/* Add Blog Card */}
      <div className="w-full max-w-2xl  text-gray-900 rounded-2xl shadow-xl p-6 mb-8 blog-container">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600 blog-subheading blog-header">Create a New Post</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 blog-inputs">
          <input
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Enter blog content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addBlog}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md"
          >
            + Add Blog
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="w-full max-w-3xl space-y-4 blog-list">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-200">No blogs yet. Create one above 👆</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-xl transition-all"
            >
              <div className="blog-card">
                <h2 className="text-lg font-bold text-indigo-700">{blog.title}</h2>
                 <p className="meta">
      Published on{" "}
      {new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}{" "}
      by <strong>{blog.authorname}</strong>
    </p>
    
                <p className="text-gray-700 mt-1 blog-content">{blog.content}</p>
              </div>
              <button
                onClick={() => deleteBlog(blog._id)}
                className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManager;
