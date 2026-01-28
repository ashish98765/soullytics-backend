const express = require("express");
const router = express.Router();

const { DecisionOrchestrator } = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");
const { buildContext } = require("../core/contextBuilder");
const ingestAdsData = require("../core/adsDataIngestor");

router.post("/decision", async (req, res) => {
  try {
    /* 1️⃣ Build clean context */
    const context = buildContext(req.body);

    /* 2️⃣ Ingest ads data (optional but powerful) */
    const adsData = await ingestAdsData(req.body);
    context.adsMetrics = adsData.available ? adsData : null;

    /* 3️⃣ Load all engines (LOCKED – no change inside engines) */
    const engines = Object.values(adsCodeRegistry);

    /* 4️⃣ Orchestrator */
    const orchestrator = new DecisionOrchestrator(engines);

    /* 5️⃣ Run decision */
    const result = await orchestrator.run(context);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("DECISION ROUTE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Decision engine failed",
    });
  }
});

module.exports = router;
