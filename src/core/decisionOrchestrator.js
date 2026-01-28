// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const engineResult = require("./engineResult");
const { buildDecisionTrace } = require("./decisionTrace");

// learning / persistence (safe async)
const {
  saveDecision,
  updateEngineStats,
  detectPatterns
} = require("./decisionLearning");

const calibrateConfidence = require("./confidenceLearner");
const adjustAction = require("./finalDecisionAdjuster");

/**
 * Helper: detect engine group (NO engine change needed)
 */
function detectGroup(engineName = "") {
  const name = engineName.toLowerCase();

  if (name.includes("creative")) return "CREATIVE";
  if (name.includes("budget")) return "BUDGET";
  if (name.includes("audience")) return "AUDIENCE";
  if (name.includes("risk")) return "RISK";
  if (name.includes("scale")) return "SCALING";
  if (
    name.includes("performance") ||
    name.includes("conversion") ||
    name.includes("ctr")
  ) {
    return "PERFORMANCE";
  }
  return "GENERAL";
}

/**
 * Helper: severity mapping
 */
function mapSeverity(status) {
  if (status === "FAIL") return "HIGH";
  if (status === "WARNING") return "MEDIUM";
  return "LOW";
}

class DecisionOrchestrator {
  constructor(engines = []) {
    this.engines = engines;
  }

  async run(context = {}) {
    const decisionEngine = new DecisionEngine();
    const collectedResults = [];

    /* ------------------------------------------------
     * 1. Run all engines safely (NO CHANGE TO ENGINES)
     * ------------------------------------------------ */
    for (const Engine of this.engines) {
      try {
        const instance =
          typeof Engine === "function" ? new Engine(context) : Engine;

        if (!instance || typeof instance.run !== "function") continue;

        const result = await instance.run();
        this._normalize(result, collectedResults);
      } catch (err) {
        collectedResults.push(
          engineResult({
            engine: Engine?.name || "UnknownEngine",
            group: detectGroup(Engine?.name),
            status: "FAIL",
            severity: "HIGH",
            message: err.message || "Engine crashed",
            confidence: 0
          })
        );
      }
    }

    /* ----------------------------------------
     * 2. Feed results to decision engine
     * ---------------------------------------- */
    collectedResults.forEach(r => decisionEngine.register(r));
    const decision = decisionEngine.resolve();

    /* ----------------------------------------
     * 3. Metrics
     * ---------------------------------------- */
    const total = collectedResults.length || 1;
    const failCount = collectedResults.filter(r => r.status === "FAIL").length;
    const failRatio = failCount / total;

    /* ----------------------------------------
     * 4. Learning-based action adjustment
     * ---------------------------------------- */
    const learnedConfidence = calibrateConfidence(
      decision.confidence || 0,
      total,
      failRatio
    );

    const finalAction = adjustAction(
      decision.action,
      learnedConfidence,
      failRatio
    );

    /* ----------------------------------------
     * 5. Final status mapping
     * ---------------------------------------- */
    const finalStatus =
      finalAction === "KILL"
        ? "FAIL"
        : finalAction === "PAUSE"
        ? "WARNING"
        : "PASS";

    /* ----------------------------------------
     * 6. Fire-and-forget learning (NO BLOCKING)
     * ---------------------------------------- */
    try {
      if (context.userId) {
        saveDecision(
          context.userId,
          {
            action: finalAction,
            score: decision.score || 0,
            risk: decision.risk || 0,
            confidence: learnedConfidence,
            finalStatus
          },
          { failCount, total }
        );

        updateEngineStats(collectedResults);
        detectPatterns(context.userId, { action: finalAction });
      }
    } catch (e) {
      // learning failure should never break decision flow
      console.error("Learning layer error:", e.message);
    }

    /* ----------------------------------------
     * 7. Unified frontend-ready response
     * ---------------------------------------- */
    return {
      action: finalAction,
      score: decision.score || 0,
      risk: decision.risk || 0,
      confidence: learnedConfidence,
      reasons: decision.reasons || [],
      finalStatus,
      prescription: {
        summary:
          finalAction === "SCALE"
            ? "Ads performing strongly. Ready to scale."
            : finalAction === "RUN"
            ? "Ads are healthy. Continue running."
            : finalAction === "PAUSE"
            ? "Ads paused due to weak or risky signals."
            : "Ads blocked due to critical failures.",
        next_action: finalAction,
        fail_ratio: failRatio
      },
      trace: buildDecisionTrace(
        collectedResults,
        finalStatus,
        learnedConfidence
      )
    };
  }

  /* ----------------------------------------
   * Normalize engine outputs (SAFE)
   * ---------------------------------------- */
  _normalize(result, bucket) {
    if (!result) return;

    if (Array.isArray(result)) {
      result.forEach(r => this._normalize(r, bucket));
      return;
    }

    if (result.engine && result.status) {
      bucket.push({
        ...result,
        group: result.group || detectGroup(result.engine),
        severity: mapSeverity(result.status)
      });
      return;
    }

    bucket.push(
      engineResult({
        engine: result.engine || "AnonymousEngine",
        group: detectGroup(result.engine),
        status: result.status || "PASS",
        severity: mapSeverity(result.status || "PASS"),
        score: result.score ?? null,
        message: result.message || "",
        confidence: result.confidence ?? 0.5,
        meta: result.meta || {}
      })
    );
  }
}

module.exports = DecisionOrchestrator;
