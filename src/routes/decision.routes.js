// src/routes/decision.routes.js

const express = require("express");
const router = express.Router();

const { makeDecision } = require("../controllers/decision.controller");

router.post("/decide", makeDecision);

module.exports = router;
