// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const engineResult = require("./engineResult");
const { buildDecisionTrace } = require("./decisionTrace");

const { applyLearning } = require("./learningEngine");
const { buildBenchmark } = require("./benchmarkEngine");
const calibrateConfidence = require("./confidenceCalibrator");

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run({ metrics = {}, context = {} }) {
    const decisionEngine = new DecisionEngine();
    const collectedResults = [];

    /* 1. Run engines safely */
    for (const Engine of this.engines) {
      try {
        const instance =
          typeof Engine === "function" ? new Engine(metrics) : Engine;

        if (!instance || typeof instance.run !== "function") continue;

        const result = await instance.run();
        this._normalize(result, collectedResults);
      } catch (e) {
        collectedResults.push(
          engineResult({
            engine: Engine?.name || "Unknown",
            status: "FAIL",
            severity: "HIGH",
            confidence: 0,
            message: e.message
          })
        );
      }
    }

    /* 2. Feed to decision engine */
    collectedResults.forEach(r => decisionEngine.register(r));
    let decision = decisionEngine.resolve();

    /* 3. Metrics */
    const total = collectedResults.length || 1;
    const failCount = collectedResults.filter(r => r.status === "FAIL").length;
    const failRatio = failCount / total;

    /* 4. Learning (history-based) */
    if (context.history) {
      decision = applyLearning(decision, context.history);
    }

    /* 5. Confidence calibration */
    decision.confidence = calibrateConfidence(
      decision.confidence,
      failRatio
    );

    /* 6. Final action safety */
    let finalAction = decision.action;
    if (failRatio > 0.5) finalAction = "PAUSE";

    /* 7. Benchmark (optional) */
    let benchmark = null;
    if (context.benchmarkScores) {
      benchmark = buildBenchmark(decision.score, context.benchmarkScores);
    }

    /* 8. Unified response */
    return {
      action: finalAction,
      score: decision.score,
      risk: decision.risk,
      confidence: decision.confidence,
      reasons: decision.reasons || [],
      benchmark,
      prescription: {
        summary:
          finalAction === "SCALE"
            ? "Ads performing strongly. Scaling recommended."
            : finalAction === "RUN"
            ? "Ads stable. Continue running."
            : finalAction === "PAUSE"
            ? "Performance unstable. Pause advised."
            : "Critical risk detected. Stop ads immediately.",
        next_action: finalAction,
        fail_ratio: failRatio
      },
      trace: buildDecisionTrace(
        collectedResults,
        finalAction,
        decision.confidence
      )
    };
  }

  _normalize(result, bucket) {
    if (!result) return;

    if (Array.isArray(result)) {
      result.forEach(r => this._normalize(r, bucket));
      return;
    }

    bucket.push(
      engineResult({
        engine: result.engine || "AnonymousEngine",
        status: result.status || "PASS",
        severity: result.severity || "LOW",
        score: result.score || 0,
        confidence: result.confidence ?? 0.5,
        message: result.message || "",
        meta: result.meta || {}
      })
    );
  }
}

module.exports = DecisionOrchestrator;
