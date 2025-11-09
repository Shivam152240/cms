const express = require('express');
const router = express.Router();
// simple placeholder endpoints — in real project add file upload
let images = [];
router.get('/', (req, res) => res.json(images));
router.post('/', (req, res) => {
const { url, title } = req.body;
const item = { id: Date.now(), url, title };
images.push(item);
res.json(item);
});
// allow deletion for in-memory images (module implementation)
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	const idx = images.findIndex((it) => String(it.id) === String(id));
	if (idx === -1) return res.sendStatus(404);
	images.splice(idx, 1);
	res.sendStatus(204);
});
module.exports = router;