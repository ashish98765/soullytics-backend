const express = require("express");
const router = express.Router();

const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

const apiKeyAuth = require("../middleware/apiKeyAuth");
const checkUsage = require("../core/usageGuard");
const dataIntakeController = require("../data/dataIntake.controller");

const supabase = require("../config/supabaseClient");

router.post("/decision", apiKeyAuth, async (req, res) => {
  try {
    const { platform, raw } = req.body;
    const { userId, plan } = req.apiUser;

    if (!platform || !raw) {
      return res.status(400).json({
        success: false,
        error: "PLATFORM_OR_RAW_MISSING",
      });
    }

    /* 1. Usage check */
    const usage = await checkUsage(userId, plan);
    if (!usage.allowed) {
      return res.status(402).json({
        success: false,
        error: "LIMIT_EXCEEDED",
        usage,
      });
    }

    /* 2. Data intake */
    const intake = dataIntakeController({ platform, raw });
    if (!intake.ok) {
      return res.status(400).json({
        success: false,
        stage: "DATA_VALIDATION_FAILED",
        errors: intake.errors,
      });
    }

    /* 3. Run orchestrator */
    const engines = Object.values(adsCodeRegistry);
    const orchestrator = new DecisionOrchestrator(engines);

    const decision = await orchestrator.run({
      metrics: intake.metrics,
      context: {
        userId,
        plan,
        platform,
      },
    });

    /* 4. Increment usage */
    await supabase
      .from("usage_limits")
      .update({
        used_decisions: usage.used + 1,
      })
      .eq("user_id", userId);

    /* 5. Persist decision */
    await supabase.from("decisions").insert({
      user_id: userId,
      plan,
      platform,
      action: decision.action,
      confidence: decision.confidence,
      risk: decision.risk,
      reasons: decision.reasons,
      trace: decision.trace,
      created_at: new Date().toISOString(),
    });

    return res.json({
      success: true,
      data: decision,
      usage: {
        used: usage.used + 1,
        limit: usage.limit,
      },
    });
  } catch (err) {
    console.error("DECISION API ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "DECISION_FAILED",
    });
  }
});

module.exports = router;
