const express = require("express");
const router = express.Router();

const { createAd } = require("../controllers/ads.controller");

router.post("/create", createAd);

module.exports = router;
