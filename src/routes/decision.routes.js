const express = require("express");
const router = express.Router();

const { DecisionOrchestrator } = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

router.post("/decision", async (req, res) => {
  try {
    // saare engines uthao
    const engines = Object.values(adsCodeRegistry);

    // orchestrator banao
    const orchestrator = new DecisionOrchestrator(engines);

    // run karo
    const result = await orchestrator.run(req.body);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
