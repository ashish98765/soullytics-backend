const express = require("express");
const router = express.Router();

const { normalizeGoogleAds } = require("../platforms/google.normalizer");
const { DecisionOrchestrator } = require("../core/decisionOrchestrator");

router.post("/ingest/google", async (req, res) => {
  try {
    const raw = req.body;

    // 1️⃣ Normalize Google Ads raw metrics
    const context = normalizeGoogleAds(raw);

    // 2️⃣ Run Soullytics brain
    const orchestrator = new DecisionOrchestrator();
    const decision = orchestrator.run(context);

    return res.json({
      success: true,
      platform: "google",
      decision
    });

  } catch (err) {
    console.error("Ingest Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
