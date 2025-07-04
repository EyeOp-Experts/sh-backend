const express = require("express");
const router = express.Router();
const multer = require("multer");
const { 
  createBlog,
  getAllBlogs, 
  getBlogById,
  addSection,
  updateSection,
  deleteSection,
  reorderSections
} = require("../controllers/blogController");
const { uploadToCloudinary } = require("../utils/cloudinary"); // Optional: if you're using a separate util

// Set up Multer storage (memory or disk)
const storage = multer.memoryStorage(); // or multer.diskStorage if needed
const upload = multer({ storage });

// Route for fetching all blogs — should come **before** the one with :id
router.get("/blogs", getAllBlogs);

// Route for fetching a blog by ID — must be placed **after**
router.get("/blogs/:id", getBlogById);

// Route to create blog with image upload and initial section
router.post("/blogs", upload.single("thumbnail"), createBlog);

// Section management routes
// Add a new section to an existing blog
router.post("/blogs/:blogId/sections", addSection);

// Update a specific section
router.put("/blogs/:blogId/sections/:sectionId", updateSection);

// Delete a specific section
router.delete("/blogs/:blogId/sections/:sectionId", deleteSection);

// Reorder sections
router.put("/blogs/:blogId/sections/reorder", reorderSections);

module.exports = router;
