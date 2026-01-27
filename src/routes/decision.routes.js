const express = require("express");
const router = express.Router();

const { decisionOrchestrator } = require("../core/decisionOrchestrator");

// POST /api/decision
router.post("/decision", async (req, res) => {
  try {
    const result = await decisionOrchestrator(req.body);
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("Decision error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Decision failed"
    });
  }
});

module.exports = router;
