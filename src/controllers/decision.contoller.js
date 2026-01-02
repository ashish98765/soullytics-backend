// src/controllers/decision.controller.js

const decisionEngine = require("../engines/decision.engine");

exports.makeDecision = (req, res) => {
  try {
    const decision = decisionEngine(req.body);

    res.json({
      status: "success",
      engine: "decision",
      decision
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Decision engine failed"
    });
  }
};
