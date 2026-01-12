// src/routes/decision.routes.js

const express = require("express");
const router = express.Router();

// ⚠️ Supabase optional hai – agar env/config nahi hai to bhi backend crash nahi karega
let supabase = null;
try {
  supabase = require("../lib/supabaseClient").supabase;
} catch (e) {
  console.warn("Supabase not configured, skipping DB writes");
}

const decisionOrchestrator = require("../core/decisionOrchestrator");

/**
 * POST /api/decision/debug
 * Internal decision execution (no auth yet)
 */
router.post("/decision/debug", async (req, res) => {
  try {
    const context = req.body || {};

    const decision = await decisionOrchestrator(context);

    // Optional DB log
    if (supabase) {
      await supabase.from("decisions").insert({
        mode: "DEBUG",
        decision: decision.decision,
        confidence: decision.confidence,
        risk: decision.risk,
        why: decision.why,
        created_at: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      decision
    });
  } catch (err) {
    console.error("Decision Debug Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Decision engine failed"
    });
  }
});

/**
 * GET /api/decision/health
 */
router.get("/decision/health", (_, res) => {
  res.json({
    status: "ok",
    engine: "Soullytics Decision Engine",
    time: new Date().toISOString()
  });
});

module.exports = router;
