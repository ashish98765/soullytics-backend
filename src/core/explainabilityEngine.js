const { ExplainabilityEngine } = require("../adsCode44.explainabilityEngine");
const { DecisionConfidenceScoreEngine } = require("../adsCode46.decisionConfidenceScore");

class ExplainabilityCoreEngine {
  constructor(context) {
    this.context = context;
  }

  run(finalDecision, results) {
    return {
      explanation: new ExplainabilityEngine({
        finalDecision,
        results
      }).run(),
      confidence: new DecisionConfidenceScoreEngine({
        finalDecision,
        results
      }).run()
    };
  }
}

module.exports = { ExplainabilityCoreEngine };
