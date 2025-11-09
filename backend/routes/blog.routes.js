const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blog.model");
const User = require("../models/user.model");

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Create a blog. If authorId isn't supplied in body, try to read from JWT.
router.post("/", async (req, res) => {
  try {
    const { title, content, authorId, authorname } = req.body;

    // Prefer explicit authorId from body, otherwise try JWT
    let finalAuthorId = authorId || null;
    const token = req.headers.authorization?.split(' ')[1];
    if (!finalAuthorId && token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        finalAuthorId = decoded?.id || null;
      } catch (e) {
        console.warn('Invalid JWT when creating blog:', e.message || e);
      }
    }

    // Strict validation: must have valid authorId
    if (
      !finalAuthorId ||
      typeof finalAuthorId !== 'string' ||
      finalAuthorId.trim() === '' ||
      finalAuthorId === 'null' ||
      finalAuthorId === 'undefined' ||
      !mongoose.Types.ObjectId.isValid(finalAuthorId)
    ) {
      return res.status(400).json({ message: 'Please signup first' });
    }

    // Populate display name from user record if available
    let finalAuthorName = authorname || 'Anonymous';
    if (finalAuthorId && (!authorname || authorname === 'Anonymous')) {
      try {
        const user = await User.findById(finalAuthorId).select('name email');
        if (user) finalAuthorName = user.name || finalAuthorName;
      } catch (e) {
        console.warn('Error fetching user to populate authorname:', e.message || e);
      }
    }

    const blog = new Blog({ title, content, authorId: finalAuthorId, authorname: finalAuthorName });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Error creating blog' });
  }
});


// router.post("/", async (req, res) => {
//   try {
//     const { title, content, authorId, authorName } = req.body;

//     const blog = new Blog({
//       title,
//       content,
//       authorId: authorId || null,
//       authorName: authorName || "Anonymous",
//     });

//     await blog.save();
//     res.json(blog);
//   } catch (err) {
//     console.error("Error creating blog:", err);
//     res.status(500).json({ message: "Error creating blog" });
//   }
// });








router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the user is the author of the blog
    if (blog.authorId.toString() !== decoded.id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own blogs' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Error deleting blog' });
  }
});

module.exports = router;
