/**
 * adsCode44.explainabilityEngine.js
 * --------------------------------------------------
 * PURPOSE:
 * Explain WHY a decision was taken.
 * Builds trust and transparency.
 */

class ExplainabilityEngine {
  constructor(engineResults = []) {
    this.engineResults = engineResults;
  }

  run(finalDecision) {
    const failed = this.engineResults.filter(r => r.status === "FAIL");
    const warnings = this.engineResults.filter(r => r.status === "WARNING");
    const passes = this.engineResults.filter(r => r.status === "PASS");

    const topDrivers = [...failed, ...warnings]
      .sort((a, b) => b.authority - a.authority)
      .slice(0, 5)
      .map(r => ({
        engine: r.engine,
        message: r.message,
        impact: r.impact,
        score: r.score
      }));

    return {
      decision: finalDecision,
      summary: {
        failedEngines: failed.length,
        warningEngines: warnings.length,
        passedEngines: passes.length
      },
      primaryReasons: topDrivers,
      explanation:
        finalDecision === "KILL"
          ? "Multiple high-authority engines detected capital risk."
          : finalDecision === "PAUSE"
          ? "Signals unstable. Waiting protects capital."
          : finalDecision === "SCALE"
          ? "Strong signals with controlled risk."
          : "Performance acceptable but not scale-ready."
    };
  }
}

module.exports = { ExplainabilityEngine };
