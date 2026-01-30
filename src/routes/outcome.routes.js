const express = require("express");
const router = express.Router();

const supabase = require("../config/supabaseClient");
const { updateEngineScores } = require("../services/engineLearning");

/**
 * POST /api/v1/outcome
 * Records outcome of a decision and updates engine learning
 */
router.post("/outcome", async (req, res) => {
  try {
    const {
      decisionId,
      actionTaken,     // true / false
      resultStatus,    // SUCCESS | NEUTRAL | FAIL
      engines = [],    // engine names involved
      ctr,
      cpa,
      roas
    } = req.body;

    if (!decisionId || !resultStatus) {
      return res.status(400).json({
        success: false,
        error: "DECISION_ID_OR_RESULT_MISSING"
      });
    }

    // 1. Store outcome
    const { error } = await supabase
      .from("decision_outcomes")
      .insert({
        decision_id: decisionId,
        action_taken: actionTaken ?? false,
        result_status: resultStatus,
        ctr_after: ctr ?? null,
        cpa_after: cpa ?? null,
        roas_after: roas ?? null
      });

    if (error) {
      console.error("OUTCOME_INSERT_ERROR:", error);
      return res.status(500).json({ success: false });
    }

    // 2. Update engine learning scores (soft learning)
    if (engines.length > 0) {
      await updateEngineScores(engines, resultStatus);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("OUTCOME_API_ERROR:", err);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
