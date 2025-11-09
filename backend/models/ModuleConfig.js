const mongoose = require('mongoose');
const ModuleConfigSchema = new mongoose.Schema({
name: { type: String, required: true, unique: true },
active: { type: Boolean, default: false }
});
module.exports = mongoose.model('ModuleConfig', ModuleConfigSchema);