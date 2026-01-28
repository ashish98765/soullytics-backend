const express = require("express");
const router = express.Router();

const orchestrator = require("../core/orchestrator");
const generateReasons = require("../core/reasonGenerator");
const generatePrescription = require("../core/prescriptionGenerator");

const saveDecision = require("../services/saveDecision");
const saveEngineResults = require("../services/saveEngineResults");

router.post("/", async (req, res) => {
  try {
    const { userId, campaignId, input } = req.body;

    const result = await orchestrator.run(input);

    const reasons = generateReasons(result.trace);
    const prescription = generatePrescription({
      action: result.action,
      trace: result.trace
    });

    const decision = await saveDecision({
      userId,
      campaignId,
      action: result.action,
      confidence: result.confidence,
      risk: result.risk,
      reasons,
      prescription,
      trace: result.trace
    });

    await saveEngineResults(decision.id, result.trace.engines || []);

    res.json({
      decisionId: decision.id,
      action: result.action,
      confidence: result.confidence,
      risk: result.risk,
      reasons,
      prescription
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Decision processing failed" });
  }
});

module.exports = router;
