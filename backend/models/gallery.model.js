const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
