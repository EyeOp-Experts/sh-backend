const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash("jk@admin", 10);

  const admin = new Admin({
    email: "JatinAdmin",
    password: hashedPassword,
  });

  await admin.save();
  console.log("Admin user created.");
  mongoose.disconnect();
}

createAdmin();
