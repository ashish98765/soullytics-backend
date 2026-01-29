// src/routes/decision.routes.js

const express = require("express");
const router = express.Router();

/* Core */
const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

/* Middlewares */
const apiKeyAuth = require("../middlewares/apiKeyAuth");

/* Guards & Controllers */
const checkUsage = require("../core/usageGuard");
const dataIntakeController = require("../data/dataIntake.controller");

/* DB */
const supabase = require("../config/supabaseClient");

/**
 * POST /api/decision
 * Protected via API Key
 */
router.post("/decision", apiKeyAuth, async (req, res) => {
  try {
    const { platform, raw } = req.body;
    const { userId, plan } = req.apiUser;

    /* 1. Basic validation */
    if (!platform || !raw) {
      return res.status(400).json({
        success: false,
        error: "PLATFORM_OR_RAW_MISSING",
      });
    }

    /* 2. Usage guard */
    const usage = await checkUsage(userId, plan);
    if (!usage.allowed) {
      return res.status(402).json({
        success: false,
        error: "LIMIT_EXCEEDED",
        usage,
      });
    }

    /* 3. Data intake & normalization */
    const intake = dataIntakeController({ platform, raw });
    if (!intake.ok) {
      return res.status(400).json({
        success: false,
        stage: "DATA_VALIDATION_FAILED",
        errors: intake.errors,
      });
    }

    /* 4. Run decision orchestrator */
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

    /* 5. Increment usage */
    await supabase
      .from("usage_limits")
      .update({
        used_decisions: usage.used + 1,
      })
      .eq("user_id", userId);

    /* 6. Persist decision */
    await supabase.from("decisions").insert({
      user_id: userId,
      plan,
      platform,
      action: decision.action,
      confidence: decision.confidence,
      risk: decision.risk,
      reasons: decision.reasons || null,
      trace: decision.trace || null,
      created_at: new Date().toISOString(),
    });

    /* 7. Response */
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
