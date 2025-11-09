const express = require('express');
const router = express.Router();
const Blog = require('./blog.model');


router.get('/', async (req, res) => {
const posts = await Blog.find().sort({ createdAt: -1 }).lean();
res.json(posts);
});


router.post('/', async (req, res) => {
const { title, body, author } = req.body;
const post = new Blog({ title, body, author });
await post.save();
res.json(post);
});


router.put('/:id', async (req, res) => {
const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(post);
});


router.delete('/:id', async (req, res) => {
await Blog.findByIdAndDelete(req.params.id);
res.json({ success: true });
});


module.exports = router;