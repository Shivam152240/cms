const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
	title: String,
	body: String,
	author: String,
	createdAt: { type: Date, default: Date.now }
});

// Use existing compiled model if available to avoid OverwriteModelError in dev hot-reload
module.exports = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);