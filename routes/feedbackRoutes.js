const express = require("express");
const multer = require("multer");
const { addFeedback, getAllFeedback } = require("../controllers/feedbackController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/feedbacks", upload.single("image"), addFeedback);
router.get("/feedbacks", getAllFeedback);

module.exports = router;
