const express = require("express");
const { adminLogin } = require("../controllers/adminController.js");

const router = express.Router();

router.post("/admin-login", (req, res, next) => {
    next();
  }, adminLogin);
  

module.exports = router;
