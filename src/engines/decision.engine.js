// src/engines/decision.engine.js

/**
 * Soullytics Decision Engine
 * This engine does NOT contain business logic.
 * It only aggregates results from Ads Codes (1–19).
 */

class DecisionEngine {
  constructor() {
    this.results = [];
  }

  /**
   * Register result from any Ads Code
   */
  register(engineResult) {
    this.results.push(engineResult);
  }

  /**
   * Resolve final decision based on registered engine results
   */
  resolve() {
    let hasFail = false;
    let warnings = [];
    let confidenceSum = 0;
    let scoreCount = 0;

    for (const result of this.results) {
      if (result.status === "FAIL") {
        hasFail = true;
      }

      if (result.status === "WARNING") {
        warnings.push(result.message);
      }

      if (typeof result.score === "number") {
        confidenceSum += result.score;
        scoreCount++;
      }
    }

    const confidence =
      scoreCount > 0 ? Number((confidenceSum / scoreCount).toFixed(2)) : null;

    return {
      finalDecision: hasFail ? "DO_NOT_RUN" : "RUN",
      confidence,
      warnings,
      evaluatedEngines: this.results.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reset engine for next evaluation
   */
  reset() {
    this.results = [];
  }
}

module.exports = { DecisionEngine };
