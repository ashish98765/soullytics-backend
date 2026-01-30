const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const { updateEngineScores } = require("../services/engineLearning");

router.post("/outcome", async (req, res) => {
  try {
    const {
      decisionId,
      followed,
      resultStatus,     // SUCCESS | FAIL | NEUTRAL
      engines = [],
      metrics            // { roas, cpa, ctr }
    } = req.body;

    if (!decisionId || !resultStatus) {
      return res.status(400).json({ success: false });
    }

    await supabase.from("decision_outcomes").insert({
      decision_id: decisionId,
      followed,
      result_label: resultStatus,
      outcome_metrics: metrics,
      recorded_at: new Date().toISOString()
    });

    await updateEngineScores(engines, resultStatus, metrics);

    res.json({ success: true });
  } catch (err) {
    console.error("OUTCOME_FAIL:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
