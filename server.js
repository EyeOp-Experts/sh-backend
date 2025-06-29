const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes.js");
const blogRoutes=require("./routes/blogRoutes.js")
const feedbackRoutes = require("./routes/feedbackRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", adminRoutes);
app.use("/api",blogRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", doctorRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
