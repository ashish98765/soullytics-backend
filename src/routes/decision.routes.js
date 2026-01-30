const express = require("express");
const router = express.Router();

const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");
const apiKeyAuth = require("../middlewares/apiKeyAuth");
const checkUsage = require("../core/usageGuard");
const dataIntakeController = require("../data/dataIntake.controller");
const dataSanityGuard = require("../core/dataSanityGuard");
const supabase = require("../config/supabaseClient");

router.post("/decision", apiKeyAuth, async (req, res) => {
  try {
    const { platform, raw } = req.body;
    const { userId, plan } = req.apiUser;

    if (!platform || !raw) {
      return res.status(400).json({ success: false, error: "MISSING_DATA" });
    }

    const usage = await checkUsage(userId, plan);
    if (!usage.allowed) {
      return res.status(402).json({ success: false, error: "LIMIT_EXCEEDED" });
    }

    const intake = dataIntakeController({ platform, raw });
    if (!intake.ok) {
      return res.status(400).json({ success: false, error: "INVALID_DATA" });
    }

    const sanity = dataSanityGuard(intake.metrics);
    if (!sanity.ok) {
      return res.status(400).json({
        success: false,
        error: "BAD_DATA_REJECTED",
        reason: sanity.reason
      });
    }

    const engines = Object.values(await adsCodeRegistry);
    const orchestrator = new DecisionOrchestrator(engines);

    const decision = await orchestrator.run({
      metrics: intake.metrics,
      context: { userId, plan, platform }
    });

    await supabase.from("decisions").insert({
      user_id: userId,
      platform,
      action: decision.action,
      confidence: decision.confidence,
      risk: decision.risk,
      trace: decision.trace,
      created_at: new Date().toISOString()
    });

    res.json({ success: true, data: decision });
  } catch (err) {
    console.error("DECISION_API_FAIL", err);
    res.status(500).json({ success: false, error: "DECISION_FAILED" });
  }
});

module.exports = router;
