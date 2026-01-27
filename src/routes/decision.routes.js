// src/routes/decision.routes.js

const express = require("express");
const router = express.Router();

const decisionOrchestrator = require("../core/decisionOrchestrator");

router.post("/", async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Empty request body"
      });
    }

    const result = await decisionOrchestrator(payload);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Decision route error:", err);

    return res.status(500).json({
      success: false,
      error: "Decision processing failed"
    });
  }
});

module.exports = router;
