const express = require("express");
const router = express.Router();

const { decide } = require("../controllers/decision.controller");

router.post("/decide", decide);

module.exports = router;
