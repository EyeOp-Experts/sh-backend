const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true }, // e.g., Surgeon, Gynaecologist
  experience: { type: String, required: true }, // e.g., "10 years"
  qualifications: { type: String, required: true },
  videoUrl: { type: String }, // YouTube link
  profileImage: { type: String, required: true }, // Cloudinary URL
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
