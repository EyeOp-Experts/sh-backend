const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createBlog,getAllBlogs, getBlogById} = require("../controllers/blogController");
const { uploadToCloudinary } = require("../utils/cloudinary"); // Optional: if you're using a separate util



// Route for fetching all blogs — should come **before** the one with :id
router.get("/blogs", getAllBlogs);

// Route for fetching a blog by ID — must be placed **after**
router.get("/blogs/:id", getBlogById);


// Set up Multer storage (memory or disk)
const storage = multer.memoryStorage(); // or multer.diskStorage if needed
const upload = multer({ storage });

// Route to create blog with image upload
router.post("/blogs", upload.single("thumbnail"), createBlog);



module.exports = router;
