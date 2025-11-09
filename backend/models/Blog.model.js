const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  authorname: { type: String, default: "Anonymous" },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid OverwriteModelError when this file is loaded multiple times
// (e.g. during tests or when modules are reloaded). Reuse the compiled
// model if it already exists on mongoose.models.
module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);