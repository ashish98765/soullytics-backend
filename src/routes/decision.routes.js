const express = require("express");
const router = express.Router();

/* Core */
const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

/* Middleware */
const apiKeyAuth = require("../middlewares/apiKeyAuth");

/* Guards */
const checkUsage = require("../core/usageGuard");

/* Controllers */
const dataIntakeController = require("../data/dataIntake.controller");

/* DB */
const supabase = require("../config/supabaseClient");

/**
 * POST /api/v1/decision
 * Protected via API Key
 */
router.post("/decision", apiKeyAuth, async (req, res) => {
  try {
    /* Kill Switch */
    if (process.env.SOULLYTICS_DISABLED === "true") {
      return res.status(503).json({
        success: false,
        error: "SERVICE_TEMPORARILY_DISABLED",
      });
    }

    const { platform, raw } = req.body;
    const { userId, plan } = req.apiUser;

    if (!platform || !raw) {
      return res.status(400).json({
        success: false,
        error: "PLATFORM_OR_RAW_MISSING",
      });
    }

    /* 1. Usage Guard */
    const usage = await checkUsage(userId, plan);
    if (!usage.allowed) {
      return res.status(402).json({
        success: false,
        error: "LIMIT_EXCEEDED",
        usage,
      });
    }

    /* 2. Data Intake */
    const intake = dataIntakeController({ platform, raw });
    if (!intake.ok) {
      return res.status(400).json({
        success: false,
        stage: "DATA_VALIDATION_FAILED",
        errors: intake.errors,
      });
    }

    /* 3. Decision Engines */
    const engines = Object.values(adsCodeRegistry);
    const orchestrator = new DecisionOrchestrator(engines);

    const decision = await orchestrator.run({
      metrics: intake.metrics,
      context: { userId, plan, platform },
    });

    /* 4. Increment Usage */
    await supabase
      .from("usage_limits")
      .update({ used_decisions: usage.used + 1 })
      .eq("user_id", userId);

    /* 5. Persist Decision */
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

    /* 6. Response */
    return res.json({
      success: true,
      data: decision,
      usage: {
        used: usage.used + 1,
        limit: usage.limit,
      },
    });
  } catch (err) {
    console.error("DECISION_API_ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "DECISION_FAILED",
    });
  }
});

module.exports = router;
