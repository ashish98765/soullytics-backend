const express = require("express");
const router = express.Router();

const { DecisionOrchestrator } = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

// persistence
const resolveUser = require("../core/decisionPersistence");
const supabase = require("../config/supabaseClient");

/**
 * POST /decision
 * body must include:
 * {
 *   email: string,
 *   plan: "starter" | "growth" | "pro" | "agency",
 *   ...decisionContext
 * }
 */
router.post("/decision", async (req, res) => {
  try {
    const { email, plan = "starter" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "EMAIL_REQUIRED",
      });
    }

    /* -------------------------------------------------
       1. Resolve user + usage row
    ------------------------------------------------- */
    const user = await resolveUser(email, plan);

    const month = new Date().toISOString().slice(0, 7);

    const { data: usage, error } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    if (error) throw error;

    /* -------------------------------------------------
       2. PLAN LIMIT CHECK  (CORE SaaS GATE)
    ------------------------------------------------- */
    const LIMITS = {
      starter: 50,
      growth: 500,
      pro: 5000,
      agency: Infinity,
    };

    const decisionLimit = LIMITS[plan] ?? 50;

    if (usage.used_decisions >= decisionLimit) {
      return res.status(402).json({
        success: false,
        error: "LIMIT_EXCEEDED",
        message: "Your monthly decision limit is over. Please upgrade.",
        plan,
        used: usage.used_decisions,
        limit: decisionLimit,
      });
    }

    /* -------------------------------------------------
       3. Run decision system (NO ENGINE CHANGE)
    ------------------------------------------------- */
    const engines = Object.values(adsCodeRegistry);
    const orchestrator = new DecisionOrchestrator(engines);

    const decisionResult = await orchestrator.run(req.body);

    /* -------------------------------------------------
       4. Increment usage
    ------------------------------------------------- */
    await supabase
      .from("usage_limits")
      .update({
        used_decisions: usage.used_decisions + 1,
      })
      .eq("id", usage.id);

    /* -------------------------------------------------
       5. Final response
    ------------------------------------------------- */
    res.json({
      success: true,
      data: decisionResult,
      usage: {
        plan,
        used: usage.used_decisions + 1,
        limit: decisionLimit,
        remaining:
          decisionLimit === Infinity
            ? Infinity
            : decisionLimit - (usage.used_decisions + 1),
      },
    });
  } catch (err) {
    console.error("DECISION ROUTE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
