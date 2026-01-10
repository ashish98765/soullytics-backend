// src/routes/decision.routes.js

const express = require("express");
const router = express.Router();
const { supabase } = require("../lib/supabaseClient");
const { DecisionOrchestrator } = require("../core/decisionOrchestrator");

// ===============================
// DEBUG / INTERNAL DECISION ENDPOINT
// ===============================
router.post("/decision/debug", async (req, res) => {
  try {
    const context = req.body || {};

    const orchestrator = new DecisionOrchestrator();
    const decision = orchestrator.run(context);

    const { error } = await supabase.from("decisions").insert({
      mode: "DEBUG",
      final_decision: decision.finalDecision,
      confidence: decision.confidence,
      trace: decision.trace,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
    }

    return res.json({
      success: true,
      decision
    });
  } catch (err) {
    console.error("Decision Debug Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ===============================
// DECISION HISTORY
// ===============================
router.get("/decision/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("decisions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.json({
      success: true,
      count: data.length,
      decisions: data
    });
  } catch (err) {
    console.error("Decision History Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
