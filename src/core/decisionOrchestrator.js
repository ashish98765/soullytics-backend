// src/core/decisionOrchestrator.js

const DecisionEngine = require("./decisionEngine");
const engineResult = require("./engineResult");
const { buildDecisionTrace } = require("./decisionTrace");

/**
 * Detect engine group from engine name
 * (NO engine code changes needed)
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
  )
    return "PERFORMANCE";

  return "GENERAL";
}

/**
 * Map status → severity
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

    /**
     * 1. Run all engines safely
     */
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

    /**
     * 2. Feed results to decision engine
     */
    collectedResults.forEach(r => decisionEngine.register(r));
    const decision = decisionEngine.resolve();

    /**
     * 3. Final action logic (SAFE SCALE)
     */
    const total = collectedResults.length || 1;
    const failCount = collectedResults.filter(r => r.status === "FAIL").length;
    const failRatio = failCount / total;

    let finalAction = decision.action;

    if (
      decision.action === "RUN" &&
      decision.confidence >= 0.75 &&
      decision.risk <= 0.3 &&
      failRatio <= 0.1
    ) {
      finalAction = "SCALE";
    }

    /**
     * 4. Final status mapping
     */
    const finalStatus =
      finalAction === "KILL"
        ? "FAIL"
        : finalAction === "PAUSE"
        ? "WARNING"
        : "PASS";

    /**
     * 5. Unified response (frontend ready)
     */
    return {
      action: finalAction,
      score: decision.score || 0,
      risk: decision.risk || 0,
      confidence: decision.confidence || 0,
      reasons: decision.reasons || [],
      finalStatus,
      trace: buildDecisionTrace(
        collectedResults,
        finalStatus,
        decision.confidence || 0
      )
    };
  }

  /**
   * Normalize engine output
   */
  _normalize(result, bucket) {
    if (!result) return;

    // Array of results
    if (Array.isArray(result)) {
      result.forEach(r => this._normalize(r, bucket));
      return;
    }

    // Already normalized
    if (result.engine && result.status) {
      bucket.push({
        ...result,
        group: result.group || detectGroup(result.engine),
        severity: mapSeverity(result.status)
      });
      return;
    }

    // Fallback
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
