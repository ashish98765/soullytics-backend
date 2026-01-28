const express = require("express");
const router = express.Router();

const DecisionOrchestrator = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

const resolveUser = require("../core/decisionPersistence");
const supabase = require("../config/supabaseClient");

/**
 * POST /decision
 * body:
 * {
 *   email: string,
 *   plan: "starter" | "growth" | "pro" | "agency",
 *   ...decisionContext
 * }
 */
router.post("/decision", async (req, res) => {
  try {
    const { email, plan = "starter", ...input } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "EMAIL_REQUIRED"
      });
    }

    /* 1️⃣ Resolve user + usage row */
    const user = await resolveUser(email, plan);

    const month = new Date().toISOString().slice(0, 7);

    const { data: usage, error: usageErr } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    if (usageErr) throw usageErr;

    /* 2️⃣ Plan limits */
    const LIMITS = {
      starter: 50,
      growth: 500,
      pro: 5000,
      agency: Infinity
    };

    const decisionLimit = LIMITS[plan] ?? 50;

    if (usage.used_decisions >= decisionLimit) {
      return res.status(402).json({
        success: false,
        error: "LIMIT_EXCEEDED",
        used: usage.used_decisions,
        limit: decisionLimit
      });
    }

    /* 3️⃣ Run decision system (NO engine change) */
    const engines = Object.values(adsCodeRegistry);
    const orchestrator = new DecisionOrchestrator(engines);

    const decisionResult = await orchestrator.run(input);

    /* 4️⃣ Increment usage */
    await supabase
      .from("usage_limits")
      .update({
        used_decisions: usage.used_decisions + 1
      })
      .eq("id", usage.id);

    /* 5️⃣ Save decision */
    await supabase.from("decisions").insert({
      user_id: user.id,
      plan,
      action: decisionResult.action,
      confidence: decisionResult.confidence,
      risk: decisionResult.risk,
      trace: decisionResult.trace,
      created_at: new Date().toISOString()
    });

    /* 6️⃣ Final response */
    res.json({
      success: true,
      data: decisionResult,
      usage: {
        used: usage.used_decisions + 1,
        limit: decisionLimit,
        remaining:
          decisionLimit === Infinity
            ? Infinity
            : decisionLimit - (usage.used_decisions + 1)
      }
    });
  } catch (err) {
    console.error("DECISION ROUTE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
