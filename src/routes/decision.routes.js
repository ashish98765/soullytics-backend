const express = require("express");
const router = express.Router();

const { DecisionOrchestrator } = require("../core/decisionOrchestrator");
const adsCodeRegistry = require("../engines/adsCodeRegistry");

const resolveUser = require("../core/decisionPersistence");
const buildContext = require("../core/contextBuilder");
const generatePrescription = require("../core/prescriptionGenerator");

/**
 * POST /api/decision
 */
router.post("/decision", async (req, res) => {
  try {
    // 1. User resolve (email required)
    if (!req.body.email) {
      return res.status(400).json({
        success: false,
        error: "email is required"
      });
    }

    const user = await resolveUser(req.body.email);

    // 2. Context build
    const context = buildContext(req.body);

    // 3. Load all engines (NO CHANGE to engines)
    const engines = Object.values(adsCodeRegistry);

    // 4. Orchestrator run
    const orchestrator = new DecisionOrchestrator(engines);
    const decisionResult = await orchestrator.run(context);

    // 5. Prescription layer (EXPLAIN TO USER)
    const prescription = generatePrescription(decisionResult);

    // 6. Final response
    res.json({
      success: true,
      data: {
        decision: decisionResult,
        prescription
      }
    });

  } catch (err) {
    console.error("DECISION ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  }
});

module.exports = router;
