// src/routes/decision.routes.js

const express = require("express");
const router = express.Router();

const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

const resolveUser = require("../core/decisionPersistence");
const usageGuard = require("../core/usageGuard");

const dataIntakeController = require("../data/dataIntake.controller");
const supabase = require("../config/supabaseClient");

/**
 * POST /api/decision
 */
router.post("/decision", async (req, res) => {
  try {
    const {
      email,
      plan = "free",
      platform = "generic",
      raw
    } = req.body;

    /* 1. Basic validation */
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "EMAIL_REQUIRED"
      });
    }

    if (!raw) {
      return res.status(400).json({
        success: false,
        error: "RAW_DATA_REQUIRED"
      });
    }

    /* 2. Resolve user */
    const user = await resolveUser(email, plan);

    /* 3. Usage guard (FREE / PAID logic lives here) */
    const usage = await usageGuard(user);

    if (!usage.allowed) {
      return res.status(402).json({
        success: false,
        error: "USAGE_LIMIT_REACHED",
        usage
      });
    }

    /* 4. Data intake & validation (CRITICAL LAYER) */
    const intake = dataIntakeController({
      platform,
      raw
    });

    if (!intake.ok) {
      return res.status(400).json({
        success: false,
        stage: "DATA_VALIDATION_FAILED",
        errors: intake.errors
      });
    }

    /* 5. Run decision engines */
    const engines = Object.values(adsCodeRegistry);
    const orchestrator = new DecisionOrchestrator(engines);

    const decisionResult = await orchestrator.run({
      metrics: intake.metrics,
      context: {
        userId: user.id,
        plan,
        platform
      }
    });

    /* 6. Persist decision (NON BLOCKING OK) */
    await supabase.from("decisions").insert({
      user_id: user.id,
      plan,
      platform,
      action: decisionResult.action,
      confidence: decisionResult.confidence,
      risk: decisionResult.risk,
      reasons: decisionResult.reasons || [],
      trace: decisionResult.trace || {},
      created_at: new Date().toISOString()
    });

    /* 7. Final response */
    return res.json({
      success: true,
      data: decisionResult,
      usage
    });

  } catch (err) {
    console.error("DECISION ROUTE ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "DECISION_FAILED"
    });
  }
});

module.exports = router;
