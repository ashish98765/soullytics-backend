// src/routes/soullytics.routes.js

const express = require("express");
const router = express.Router();

const {
  handleSoullytics
} = require("../controllers/soullytics.controller.js");

// Single Soullytics entry point
router.post("/soullytics", handleSoullytics);

module.exports = router;
