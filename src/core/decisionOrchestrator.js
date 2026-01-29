// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const adjustAction = require("./finalDecisionAdjuster");
const { applyLearning } = require("./learningEngine");
const { fetchHistory } = require("./learningRepository");

/**
 * DecisionOrchestrator
 * Runs all adscode engines safely
 * Aggregates signals
 * Applies learning & safety
 * Returns ONE final action
 */
class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics = {}, context = {} } = {}) {
    const decisionEngine = new DecisionEngine();
    const collected = [];

    /* 1. Run all engines safely */
    for (const Engine of this.engines) {
      try {
        const instance =
          typeof Engine === "function" ? new Engine(metrics) : Engine;

        if (!instance || typeof instance.run !== "function") continue;

        const result = await instance.run();
        this._normalize(result, collected);
      } catch (err) {
        collected.push({
          status: "FAIL",
          score: 0,
          risk: 1,
          confidence: 0,
          message: err.message || "ENGINE_CRASH"
        });
      }
    }

    /* 2. Register signals */
    collected.forEach(r => decisionEngine.register(r));
    let decision = decisionEngine.resolve();

    /* 3. Failure ratio (global safety metric) */
    const total = collected.length || 1;
    const failCount = collected.filter(r => r.status === "FAIL").length;
    const failRatio = failCount / total;

    /* 4. Learning (NON-BLOCKING, SAFE) */
    if (context.userId) {
      const history = await fetchHistory(context.userId, 20);
      decision = applyLearning(decision, history);
    }

    /* 5. Final action adjustment */
    const finalAction = adjustAction(
      decision.action,
      decision.confidence,
      failRatio
    );

    /* 6. Final response (single truth) */
    return {
      action: finalAction,
      score: decision.score,
      risk: decision.risk,
      confidence: decision.confidence,
      reasons: decision.reasons || [],
      meta: {
        enginesRun: total,
        enginesFailed: failCount,
        failRatio
      }
    };
  }

  /* Normalize engine outputs into safe signals */
  _normalize(result, bucket) {
    if (!result) return;

    if (Array.isArray(result)) {
      result.forEach(r => this._normalize(r, bucket));
      return;
    }

    bucket.push({
      status: result.status || "PASS",
      score: Number(result.score) || 0,
      risk: Number(result.risk) || 0,
      confidence:
        Number.isFinite(Number(result.confidence))
          ? Number(result.confidence)
          : 0.5,
      message: result.message || ""
    });
  }
}

module.exports = DecisionOrchestrator;
