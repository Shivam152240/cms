const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
});

module.exports = mongoose.model("Module", moduleSchema);
