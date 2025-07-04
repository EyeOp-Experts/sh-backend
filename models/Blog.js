const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    required: true,
    trim: true
  },
  sectionContent: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
});

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  sections: [sectionSchema], // Array of sections instead of single content
  thumbnailUrl: String,
  metaTags: [String], // ✅ Array of strings
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
