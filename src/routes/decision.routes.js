const express = require("express");
const router = express.Router();

const decisionOrchestrator = require("../core/decisionOrchestrator");

router.post("/decision", async (req, res) => {
  try {
    const result = await decisionOrchestrator(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("DECISION ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
