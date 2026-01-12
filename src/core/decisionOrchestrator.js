// src/core/decisionOrchestrator.js

// ===============================
// IMPORT CORE ENGINES
// ===============================
const DataTrustEngine = require("./engines/dataTrust.engine");
const AdLogicValidityEngine = require("./engines/adLogicValidity.engine");
const CreativeHealthEngine = require("./engines/creativeHealth.engine");
const CapitalSafetyEngine = require("./engines/capitalSafety.engine");
const ScalingReadinessEngine = require("./engines/scalingReadiness.engine");
const FutureRiskEngine = require("./engines/futureRisk.engine");
const HumanBiasControlEngine = require("./engines/humanBias.engine");
const SystemStabilityEngine = require("./engines/systemStability.engine");
const LearningMemoryEngine = require("./engines/learningMemory.engine");
const DecisionAuthorityEngine = require("./engines/decisionAuthority.engine");
const DecisionExplanationEngine = require("./engines/decisionExplanation.engine");
const ActionGuidanceEngine = require("./engines/actionGuidance.engine");

// ===============================
// SAFETY HELPERS
// ===============================
async function safeRun(engine, context, fallback) {
  try {
    return await engine.run(context);
  } catch (err) {
    return fallback(err);
  }
}

function normalizeConfidence(confidence) {
  if (typeof confidence === "number") {
    return Math.min(1, Math.max(0, confidence));
  }
  if (confidence === "HIGH") return 0.85;
  if (confidence === "MEDIUM") return 0.6;
  return 0.35;
}

function earlyExit({ decision, reason }) {
  return {
    decision,
    confidence: 0.3,
    risk: "HIGH",
    why: [reason],
    moneyAdvice: "Do not increase budget",
    ifIgnored: "High probability of loss"
  };
}

// ===============================
// MAIN ORCHESTRATOR
// ===============================
async function decisionOrchestrator(context = {}) {
  /**
   * context contains:
   * - platform (google | meta)
   * - metrics (CTR, CPC, CPA, ROAS, spend, impressions, time)
   * - historicalData (optional)
   * - userProfile (risk appetite, budget size)
   */

  // ---- STEP 1: TRUST THE DATA ----
  const dataTrust = await safeRun(
    DataTrustEngine,
    context,
    () => ({ trusted: false })
  );

  if (!dataTrust.trusted) {
    return earlyExit({
      decision: "PAUSE",
      reason: "Data not reliable yet"
    });
  }

  // ---- STEP 2: BASIC AD LOGIC ----
  const adLogic = await safeRun(
    AdLogicValidityEngine,
    context,
    () => ({ valid: false })
  );

  if (!adLogic.valid) {
    return earlyExit({
      decision: "STOP",
      reason: "Ad setup invalid"
    });
  }

  // ---- STEP 3: CREATIVE HEALTH ----
  const creativeHealth = await safeRun(
    CreativeHealthEngine,
    context,
    () => ({ score: 0.3, status: "UNSTABLE" })
  );

  // ---- STEP 4: CAPITAL SAFETY ----
  const capitalSafety = await safeRun(
    CapitalSafetyEngine,
    context,
    () => ({ safe: false })
  );

  if (!capitalSafety.safe) {
    return earlyExit({
      decision: "STOP",
      reason: "Capital at risk"
    });
  }

  // ---- STEP 5: SCALING READINESS ----
  const scalingReadiness = await safeRun(
    ScalingReadinessEngine,
    context,
    () => ({ ready: false, score: 0.4 })
  );

  // ---- STEP 6: FUTURE RISK ----
  const futureRisk = await safeRun(
    FutureRiskEngine,
    context,
    () => ({ level: "HIGH", ifIgnoredImpact: "Loss likely" })
  );

  // ---- STEP 7: HUMAN BIAS CHECK ----
  const humanBias = await safeRun(
    HumanBiasControlEngine,
    context,
    () => ({ biasDetected: false })
  );

  // ---- STEP 8: SYSTEM STABILITY ----
  const systemStability = await safeRun(
    SystemStabilityEngine,
    context,
    () => ({ stable: true })
  );

  // ---- STEP 9: LEARNING & MEMORY ----
  const learningMemory = await safeRun(
    LearningMemoryEngine,
    {
      context,
      decisionSignals: {
        creativeHealth,
        capitalSafety,
        scalingReadiness,
        futureRisk
      }
    },
    () => ({ learned: false })
  );

  // ---- STEP 10: FINAL DECISION AUTHORITY ----
  const authorityDecision = await safeRun(
    DecisionAuthorityEngine,
    {
      dataTrust,
      adLogic,
      creativeHealth,
      capitalSafety,
      scalingReadiness,
      futureRisk,
      humanBias,
      systemStability,
      learningMemory
    },
    () => ({ decision: "PAUSE", confidence: "LOW" })
  );

  // ---- STEP 11: EXPLANATION ----
  const explanation = await safeRun(
    DecisionExplanationEngine,
    {
      authorityDecision,
      signals: {
        creativeHealth,
        capitalSafety,
        futureRisk
      }
    },
    () => ({ reasons: ["Decision based on limited data"] })
  );

  // ---- STEP 12: ACTION GUIDANCE ----
  const actionGuidance = await safeRun(
    ActionGuidanceEngine,
    {
      authorityDecision,
      scalingReadiness,
      futureRisk
    },
    () => ({ budgetAdvice: "Hold budget" })
  );

  // ===============================
  // FINAL API RESPONSE (LOCKED SHAPE)
  // ===============================
  return {
    decision: authorityDecision.decision,          // RUN | PAUSE | STOP | SCALE
    confidence: normalizeConfidence(authorityDecision.confidence),
    risk: futureRisk.level,                         // LOW | MEDIUM | HIGH
    why: explanation.reasons,                       // array of strings
    moneyAdvice: actionGuidance.budgetAdvice,       // +20%, -30%, hold
    ifIgnored: futureRisk.ifIgnoredImpact            // loss estimate / warning
  };
}

module.exports = { decisionOrchestrator };
