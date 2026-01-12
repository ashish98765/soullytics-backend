/**
 * adsCode45.learningMemoryEngine.js
 * --------------------------------------------------
 * PURPOSE:
 * Learn from past decisions and adjust system behavior.
 * NO prediction. NO decision.
 * Only bias & sensitivity correction.
 */

class LearningMemoryEngine {
  constructor(memoryStore = []) {
    this.memoryStore = memoryStore;
  }

  record(run) {
    this.memoryStore.push({
      timestamp: Date.now(),
      decision: run.decision,
      confidence: run.confidence || 0.5,
      risk: run.riskLevel || "UNKNOWN",
      failedEngines: run.failedEngines || [],
      outcome: run.outcome || "UNKNOWN" // later: PROFIT / LOSS / NEUTRAL
    });
  }

  evaluate() {
    if (this.memoryStore.length < 7) {
      return {
        status: "COLD",
        adjustment: "NONE",
        note: "Insufficient historical data"
      };
    }

    const recent = this.memoryStore.slice(-15);

    const stats = {
      kill: recent.filter(r => r.decision === "KILL").length,
      scale: recent.filter(r => r.decision === "SCALE").length,
      pause: recent.filter(r => r.decision === "PAUSE").length
    };

    let systemBias = "BALANCED";

    if (stats.kill > stats.scale * 2) systemBias = "OVER_DEFENSIVE";
    if (stats.scale > stats.kill * 2) systemBias = "OVER_AGGRESSIVE";

    return {
      status: "ACTIVE",
      systemBias,
      recommendation:
        systemBias === "OVER_DEFENSIVE"
          ? "Reduce fear bias. Increase SCALE threshold slightly."
          : systemBias === "OVER_AGGRESSIVE"
          ? "Increase capital protection sensitivity."
          : "System behavior stable."
    };
  }
}

module.exports = { LearningMemoryEngine };
