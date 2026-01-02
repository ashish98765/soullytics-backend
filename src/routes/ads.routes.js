// src/routes/ads.routes.js

const express = require("express");
const router = express.Router();

const { createAd } = require("../controllers/ads.controller");

// create ad
router.post("/create", createAd);

module.exports = router;
