const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./core/db');
const moduleLoader = require('./core/moduleLoader');
const ModuleConfig = require('./models/ModuleConfig');

// Routes
const blogRoutes = require("./routes/blog.routes");
const galleryRoutes = require("./routes/gallery.routes");
const authRoutes = require("./routes/auth.routes");
const adminRouter = require('./core/adminRoutes');

dotenv.config();
const app = express();

app.use(cors({ origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]}));
app.use(express.json());

// 🔹 Auth route
app.use("/api/auth", authRoutes);

// 🔹 Database connect
connectDB();
const _dirname = path.resolve();

// 🔹 Self-executing async function
(async () => {
  const defaults = ['blog', 'gallery', 'user'];
  for (const m of defaults) {
    await ModuleConfig.updateOne(
      { name: m },
      { $setOnInsert: { name: m, active: m !== 'gallery' } },
      { upsert: true }
    );
  }

  const activeModules = await ModuleConfig.find({ active: true }).lean();
  const names = activeModules.map(m => m.name);
  // If we have dedicated route files for certain features (like gallery),
  // prefer those over lightweight module placeholders. Filter out 'gallery'
  // so the proper `routes/gallery.routes.js` handles uploads and file serving.
  const filteredNames = names.filter(n => n !== 'gallery');
  moduleLoader(app, filteredNames);

  // 🔹 Admin & module routes
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use('/api/admin', adminRouter);  // Mount admin routes first
  app.use("/api/blogs", blogRoutes);
  app.use("/api/gallery", galleryRoutes);

  // Serve frontend build if it exists (so backend can serve the whole app)
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  if (fs.existsSync(frontendBuildPath)) {
    console.log('Serving frontend build from:', frontendBuildPath);
    app.use(express.static(frontendBuildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
  } else {
    // Fallback API root message when frontend build is not present
    app.get('/', (req, res) => res.send('✅ Modular CMS backend running with Auth System'));
  }
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`🚀 Server started on port ${port}`));
})();
