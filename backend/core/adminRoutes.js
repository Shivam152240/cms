const express = require('express');
const router = express.Router();
const ModuleConfig = require('../models/ModuleConfig');
const User = require('../models/user.model');
 const Blog = require("../models/Blog.model");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user's blogs
router.get('/users/:userId/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.params.userId }).sort({ createdAt: -1 });
    
    res.json(blogs);
  
  } catch (err) {
    console.error('Error fetching user blogs:', err);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Get user's gallery items
router.get('/users/:userId/gallery', async (req, res) => {
  try {
     
    const gallery = await require('../models/gallery.model').find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(gallery);
   
  } catch (err) {
    console.error('Error fetching user gallery:', err);
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

// List modules
router.get('/modules', async (req, res) => {
  try {
    const modules = await ModuleConfig.find().lean();
    res.json(modules);
  } catch (err) {
    console.error('Error fetching modules:', err);
    res.status(500).json({ message: 'Error fetching modules' });
  }
});

// Toggle module active status
router.post('/modules/:name/toggle', async (req, res) => {
  try {
    const { name } = req.params;
    const mod = await ModuleConfig.findOne({ name });
    if (!mod) return res.status(404).json({ error: 'Module not found' });
    mod.active = !mod.active;
    await mod.save();
    res.json({ success: true, module: mod });
  } catch (err) {
    console.error('Error toggling module:', err);
    res.status(500).json({ message: 'Error toggling module status' });
  }
});


// Delete a user's blog
router.delete("/blogs/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Delete a user's gallery image
router.delete("/gallery/:id", async (req, res) => {
  const Gallery = require("../models/gallery.model");
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const User = require("../models/user.model");
// const Blog = require("../models/Blog.model");
// const Gallery = require("../models/gallery.model");

// // Get all users
// router.get("/users", async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

// // Get all blogs of a specific user
// router.get("/users/:id/blogs", async (req, res) => {
//   const blogs = await Blog.find({ author: req.params.id });
//   res.json(blogs);
// });

// // Get all images of a specific user
// router.get("/users/:id/gallery", async (req, res) => {
//   const images = await Gallery.find({ userId: req.params.id });
//   res.json(images);
// });

// // Delete a user's blog
// router.delete("/blogs/:id", async (req, res) => {
//   await Blog.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// // Delete a user's gallery image
// router.delete("/gallery/:id", async (req, res) => {
//   await Gallery.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// module.exports = router;
