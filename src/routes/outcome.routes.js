const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const { updateEngineScores } = require("../services/engineLearning");

router.post("/outcome", async (req, res) => {
  const {
    decisionId,
    actionTaken,
    resultStatus,
    engines,
    ctr,
    cpa,
    roas
  } = req.body;

  await supabase.from("decision_outcomes").insert({
    decision_id: decisionId,
    action_taken: actionTaken,
    result_status: resultStatus,
    ctr_after: ctr,
    cpa_after: cpa,
    roas_after: roas
  });

  await updateEngineScores(engines, resultStatus);

  res.json({ success: true });
});

module.exports = router;
