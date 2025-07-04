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

// Create a new blog with initial section
exports.createBlog = async (req, res) => {
  try {
    let thumbnailUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      thumbnailUrl = uploaded.secure_url;
    }

    const { title, description, sectionTitle, sectionContent } = req.body;
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

    // Validate that initial section is provided
    if (!sectionTitle || !sectionContent) {
      return res.status(400).json({ message: "Initial section title and content are required" });
    }

    const blog = new Blog({
      title,
      description,
      sections: [{
        sectionTitle,
        sectionContent,
        order: 0
      }],
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

// Add a new section to an existing blog
exports.addSection = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { sectionTitle, sectionContent } = req.body;

    if (!sectionTitle || !sectionContent) {
      return res.status(400).json({ message: "Section title and content are required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Get the next order number
    const nextOrder = blog.sections.length;

    blog.sections.push({
      sectionTitle,
      sectionContent,
      order: nextOrder
    });

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error adding section:", error);
    res.status(500).json({ message: "Failed to add section" });
  }
};

// Update a specific section
exports.updateSection = async (req, res) => {
  try {
    const { blogId, sectionId } = req.params;
    const { sectionTitle, sectionContent } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const section = blog.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    if (sectionTitle) section.sectionTitle = sectionTitle;
    if (sectionContent) section.sectionContent = sectionContent;

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ message: "Failed to update section" });
  }
};

// Delete a specific section
exports.deleteSection = async (req, res) => {
  try {
    const { blogId, sectionId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const section = blog.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    section.deleteOne();
    
    // Reorder remaining sections
    blog.sections.forEach((section, index) => {
      section.order = index;
    });

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ message: "Failed to delete section" });
  }
};

// Reorder sections
exports.reorderSections = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { sectionIds } = req.body; // Array of section IDs in new order

    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ message: "sectionIds must be an array" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Create a map of section IDs to their new order
    const orderMap = {};
    sectionIds.forEach((sectionId, index) => {
      orderMap[sectionId] = index;
    });

    // Update the order of each section
    blog.sections.forEach(section => {
      if (orderMap[section._id.toString()] !== undefined) {
        section.order = orderMap[section._id.toString()];
      }
    });

    // Sort sections by order
    blog.sections.sort((a, b) => a.order - b.order);

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error reordering sections:", error);
    res.status(500).json({ message: "Failed to reorder sections" });
  }
};
