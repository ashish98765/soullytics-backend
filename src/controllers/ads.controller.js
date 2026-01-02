const express = require("express");
const router = express.Router();

const { createAd } = require("../controllers/ads.controller");

// POST /ads/create
router.post("/create", createAd);

module.exports = router;
