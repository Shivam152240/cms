const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");  // Add jwt require
// Create uploads folder if not exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});
const upload = multer({ storage });

// Import Gallery model
const Gallery = require("../models/gallery.model");

// GET all images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload new image (from local system) OR register an existing file by JSON { url }
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log('POST /api/gallery - upload attempt, file:', req.file && req.file.originalname);
    console.log("Request body:", req.body);
    // Case 1: multipart upload (file present)
    if (req.file) {
      const userId = req.body.userId;
      if (
        !userId ||
        typeof userId !== 'string' ||
        userId.trim() === '' ||
        userId === 'null' ||
        userId === 'undefined' ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res.status(400).json({ message: 'Please signup first' });
      }
      const filePath = `/uploads/${req.file.filename}`;
      const newImage = new Gallery({ url: filePath, userId: req.body.userId });
      await newImage.save();
      return res.status(201).json(newImage);
    }

    // Case 2: register an already-present file in uploads by providing JSON { url: '/uploads/filename' }
    if (req.body && req.body.url) {
      const providedUrl = req.body.url;
      // Basic validation: URL should start with /uploads/
      if (!String(providedUrl).startsWith('/uploads/')) {
        return res.status(400).json({ message: 'Provided url must start with /uploads/' });
      }
      if (!req.body.userId) {
        return res.status(400).json({ message: 'Please signup first' });
      }
      const newImage = new Gallery({ url: providedUrl, userId: req.body.userId });
      await newImage.save();
      return res.status(201).json(newImage);
    }

    console.warn('No file received in request and no url provided');
    return res.status(400).json({ message: "No file uploaded or url provided" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete image
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }

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
    
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Check if the user is the owner of the image
    if (image.userId.toString() !== decoded.id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own images' });
    }

    const imgPath = path.join(__dirname, "../", image.url);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }

    await Gallery.findByIdAndDelete(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
