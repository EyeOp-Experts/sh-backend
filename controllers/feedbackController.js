const Feedback = require("../models/Feedback");
const { uploadToCloudinary } = require("../utils/cloudinary");

exports.addFeedback = async (req, res) => {
  try {
    const { name, message, rating } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      imageUrl = uploaded.secure_url;
    }

    const feedback = new Feedback({ name, message, rating, imageUrl });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Error saving feedback", error: err.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback", error: err.message });
  }
};
