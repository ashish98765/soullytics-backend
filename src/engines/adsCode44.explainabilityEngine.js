const { engineResult } = require("../core/engineResult");

class ExplainabilityEngine {
  constructor(finalDecisionOutput) {
    this.decision = finalDecisionOutput;
  }

  run() {
    const { status, score, meta } = this.decision;

    const explanation = {
      decision: status,
      confidence: Math.round(score * 100) + "%",
      why: [],
      risks: [],
      protections: []
    };

    if (meta.failures.length) {
      explanation.why.push(
        "Multiple high-authority engines failed. Continuing would violate capital protection rules."
      );
    }

    if (meta.warnings.length) {
      explanation.risks.push(
        "Warning signals detected that may distort short-term performance."
      );
    }

    if (score > 0.7) {
      explanation.protections.push(
        "Decision backed by statistically stable and reliable signals."
      );
    } else {
      explanation.protections.push(
        "Decision chosen to prevent loss under uncertainty."
      );
    }

    meta.insights.forEach(i => {
      explanation.why.push(
        `[${i.engine}] ${i.message}`
      );
    });

    return engineResult({
      engine: "adsCode44.explainabilityEngine",
      status: "PASS",
      impact: "HIGH",
      authority: 9,
      score,
      message: `Decision explanation generated`,
      explanation
    });
  }
}

module.exports = { ExplainabilityEngine };
