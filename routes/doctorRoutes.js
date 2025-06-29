const express = require("express");
const { addDoctor, getAllDoctors } = require("../controllers/doctorController");
const multer =require("multer")
const router = express.Router();
// Set up Multer storage (memory or disk)
const storage = multer.memoryStorage(); // or multer.diskStorage if needed
const upload = multer({ storage });


router.post("/doctors", upload.single("profileImage"), addDoctor);

router.get("/doctors", getAllDoctors); // Fetch all doctors

module.exports = router;
