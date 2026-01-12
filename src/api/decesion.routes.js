const express = require("express");
const router = express.Router();

const { DecisionOrchestrator } = require("../core/decisionOrchestrator");

/**
 * POST /api/decision
 * Core Soullytics decision endpoint
 */
router.post("/decision", async (req, res) => {
  try {
    const {
      user = { plan: "FREE", decisionsToday: 0 },
      platform,
      objective,
      metrics
    } = req.body;

    // ---- Free tier gate ----
    if (user.plan === "FREE" && user.decisionsToday >= 2) {
      return res.status(403).json({
        status: "LIMIT_REACHED",
        message: "Free plan allows only 2 decisions per day."
      });
    }

    // ---- Validate input ----
    if (!platform || !objective || !metrics) {
      return res.status(400).json({
        status: "INVALID_INPUT",
        message: "platform, objective and metrics are required."
      });
    }

    // ---- Build decision context ----
    const context = {
      platform,
      objective,
      ...metrics,
      timestamp: Date.now()
    };

    // ---- Run orchestrator ----
    const orchestrator = new DecisionOrchestrator();
    const decisionResponse = orchestrator.run(context);

    return res.json({
      status: "OK",
      ...decisionResponse
    });

  } catch (err) {
    console.error("Decision API error:", err);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal decision engine failure",
      error: err.message
    });
  }
});

module.exports = router;
