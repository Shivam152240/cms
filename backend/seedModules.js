const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Module = require("./modules/module.model");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedModules = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected for seeding...");

    const modules = [
      { name: "blog", active: true },
      { name: "gallery", active: true },
      { name: "contact", active: true },
    ];

    await Module.deleteMany(); // Purane records clear kar dega
    await Module.insertMany(modules);

    console.log("🌱 Modules added successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedModules();
