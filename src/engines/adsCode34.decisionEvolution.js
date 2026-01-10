// src/engines/adsCode34.decisionEvolution.js

const { engineResult } = require("../core/engineResult");

class DecisionEvolutionEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const history = Array.isArray(this.context.decisionHistory)
      ? this.context.decisionHistory
      : [];

    const finalDecision = this.context.finalDecision;
    const overrideCount = Number(this.context.overrideCount || 0);

    // 🔁 Same bad decision repeated
    const recentSame = history
      .slice(-4)
      .filter(d => d.finalDecision === finalDecision);

    if (recentSame.length >= 3 && finalDecision !== "RUN") {
      return engineResult({
        engine: "AdsCode34_DecisionEvolution",
        status: "FAIL",
        score: 1,
        message:
          "Same risky decision repeated multiple times. System evolution is stuck."
      });
    }

    // ⚠ Human overriding system repeatedly
    if (overrideCount >= 3) {
      return engineResult({
        engine: "AdsCode34_DecisionEvolution",
        status: "WARNING",
        score: 0.7,
        message:
          "Repeated human overrides detected. Learning integrity weakening."
      });
    }

    // ⚠ No clear learning trend
    if (history.length >= 5 && recentSame.length === 0) {
      return engineResult({
        engine: "AdsCode34_DecisionEvolution",
        status: "WARNING",
        score: 0.5,
        message:
          "Decision pattern unstable. System still exploring optimal behavior."
      });
    }

    // ✅ Healthy evolution
    return engineResult({
      engine: "AdsCode34_DecisionEvolution",
      status: "PASS",
      score: 0.3,
      message:
        "Decision evolution healthy. System learning and adapting correctly."
    });
  }
}

module.exports = { DecisionEvolutionEngine };
