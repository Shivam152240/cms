require('dotenv').config();
const connectDB = require('../core/db');
const Blog = require('../models/Blog.model');
const User = require('../models/user.model');

async function migrate() {
  await connectDB();
  console.log('Starting migration: set authorId on blogs where null');

  const blogs = await Blog.find({ authorId: null });
  console.log(`Found ${blogs.length} blogs with null authorId`);

  let updated = 0;
  for (const blog of blogs) {
    const name = (blog.authorname || '').trim();
    if (!name) {
      console.log(`Skipping blog ${blog._id} because authorname empty`);
      continue;
    }

    // Try exact match by name
    let user = await User.findOne({ name: name });
    if (!user) {
      // Try case-insensitive name match
      user = await User.findOne({ name: new RegExp(`^${escapeRegExp(name)}$`, 'i') });
    }

    if (!user) {
      // Try matching by email if authorname looks like an email
      if (name.includes('@')) {
        user = await User.findOne({ email: name });
      }
    }

    if (user) {
      blog.authorId = user._id;
      await blog.save();
      updated++;
      console.log(`Updated blog ${blog._id} -> user ${user._id} (${user.name})`);
    } else {
      console.log(`No matching user found for blog ${blog._id} with authorname='${name}'`);
    }
  }

  console.log(`Migration complete. Updated ${updated} blogs.`);
  process.exit(0);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
