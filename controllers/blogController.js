const Blog = require("../models/Blog");
const { uploadToCloudinary } = require("../utils/cloudinary");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.createBlog = async (req, res) => {
  try {
    let thumbnailUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      thumbnailUrl = uploaded.secure_url;
    }

    const { title, description, content } = req.body;
    let metaTags = [];

    if (req.body.metaTags) {
      try {
        metaTags = typeof req.body.metaTags === "string"
          ? JSON.parse(req.body.metaTags)
          : req.body.metaTags;
      } catch (err) {
        return res.status(400).json({ message: "Invalid metaTags format. Expecting a JSON array like [\"tag1\", \"tag2\"]" });
      }
    }

    const blog = new Blog({
      title,
      description,
      content,
      thumbnailUrl,
      metaTags,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};
