const Doctor = require("../models/Doctor");
const { uploadToCloudinary } = require("../utils/cloudinary"); // adjust path accordingly

exports.addDoctor = async (req, res) => {
  try {
    const { name, domain, experience, qualifications, videoUrl } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Profile image file is required" });
    }

    // Use your uploadToCloudinary function with buffer and filename
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    const doctor = new Doctor({
      name,
      domain,
      experience,
      qualifications,
      videoUrl,
      profileImage: cloudinaryResult.secure_url,
    });

    await doctor.save();

    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to add doctor", error: err.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors", error: err.message });
  }
};
