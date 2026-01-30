const express = require("express");
const router = express.Router();

const apiKeyAuth = require("../middlewares/apiKeyAuth");
const checkUsage = require("../core/usageGuard");
const intelligenceGate = require("../core/intelligenceGate");
const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");
const dataSanityGuard = require("../core/dataSanityGuard");
const supabase = require("../config/supabaseClient");

router.post("/decision", apiKeyAuth, async (req, res) => {
  try {
    const { platform, metrics } = req.body;
    const { userId, plan } = req.apiUser;

    const usage = await checkUsage(userId, plan);
    if (!usage.allowed) {
      return res.status(402).json({ error: usage.reason });
    }

    const sanity = dataSanityGuard(metrics);
    if (!sanity.ok) {
      return res.status(400).json({ error: "BAD_DATA" });
    }

    const engines = Object.values(await adsCodeRegistry);
    const orchestrator = new DecisionOrchestrator(engines);

    const decision = await orchestrator.run({
      metrics,
      context: { userId, plan, platform }
    });

    await supabase.from("decisions").insert({
      user_id: userId,
      platform,
      action: decision.action,
      confidence: decision.confidence,
      risk: decision.risk,
      trace: decision.trace
    });

    const gatedResponse = intelligenceGate(decision, plan);

    res.json({ success: true, data: gatedResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DECISION_FAILED" });
  }
});

module.exports = router;
