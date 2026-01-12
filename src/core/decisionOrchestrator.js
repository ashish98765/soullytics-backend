// src/core/decisionOrchestrator.js

// ================================
// IMPORT CORE ENGINES
// ================================
const DataTrustEngine = require('./engines/dataTrust.engine');
const AdLogicValidityEngine = require('./engines/adLogicValidity.engine');
const CreativeHealthEngine = require('./engines/creativeHealth.engine');
const CapitalSafetyEngine = require('./engines/capitalSafety.engine');
const ScalingReadinessEngine = require('./engines/scalingReadiness.engine');
const FutureRiskEngine = require('./engines/futureRisk.engine');
const HumanBiasControlEngine = require('./engines/humanBias.engine');
const SystemStabilityEngine = require('./engines/systemStability.engine');
const LearningMemoryEngine = require('./engines/learningMemory.engine');
const DecisionAuthorityEngine = require('./engines/decisionAuthority.engine');
const DecisionExplanationEngine = require('./engines/decisionExplanation.engine');
const ActionGuidanceEngine = require('./engines/actionGuidance.engine');

// ================================
// MAIN ORCHESTRATOR
// ================================
async function decisionOrchestrator(context) {
  /**
   * context contains:
   * - platform (google | meta)
   * - metrics (CTR, CPC, CPA, ROAS, spend, impressions, time)
   * - historicalData (optional)
   * - userProfile (risk appetite, budget size)
   */

  // ---- STEP 1: TRUST THE DATA ----
  const dataTrust = await DataTrustEngine.run(context);
  if (!dataTrust.trusted) {
    return earlyExit({
      decision: 'PAUSE',
      reason: 'Data not reliable yet',
      dataTrust
    });
  }

  // ---- STEP 2: BASIC AD LOGIC ----
  const adLogic = await AdLogicValidityEngine.run(context);
  if (!adLogic.valid) {
    return earlyExit({
      decision: 'STOP',
      reason: 'Ad setup invalid',
      adLogic
    });
  }

  // ---- STEP 3: CREATIVE HEALTH ----
  const creativeHealth = await CreativeHealthEngine.run(context);

  // ---- STEP 4: CAPITAL SAFETY ----
  const capitalSafety = await CapitalSafetyEngine.run(context);
  if (!capitalSafety.safe) {
    return earlyExit({
      decision: 'STOP',
      reason: 'Capital at risk',
      capitalSafety
    });
  }

  // ---- STEP 5: SCALING READINESS ----
  const scalingReadiness = await ScalingReadinessEngine.run(context);

  // ---- STEP 6: FUTURE RISK ----
  const futureRisk = await FutureRiskEngine.run(context);

  // ---- STEP 7: HUMAN BIAS CHECK ----
  const humanBias = await HumanBiasControlEngine.run(context);

  // ---- STEP 8: SYSTEM STABILITY ----
  const systemStability = await SystemStabilityEngine.run(context);

  // ---- STEP 9: LEARNING & MEMORY ----
  const learningMemory = await LearningMemoryEngine.run({
    context,
    decisionSignals: {
      creativeHealth,
      capitalSafety,
      scalingReadiness,
      futureRisk
    }
  });

  // ---- STEP 10: FINAL DECISION ----
  const authorityDecision = await DecisionAuthorityEngine.run({
    dataTrust,
    adLogic,
    creativeHealth,
    capitalSafety,
    scalingReadiness,
    futureRisk,
    humanBias,
    systemStability,
    learningMemory
  });

  // ---- STEP 11: EXPLANATION ----
  const explanation = await DecisionExplanationEngine.run({
    authorityDecision,
    signals: {
      creativeHealth,
      capitalSafety,
      futureRisk
    }
  });

  // ---- STEP 12: ACTION GUIDANCE ----
  const actionGuidance = await ActionGuidanceEngine.run({
    authorityDecision,
    scalingReadiness,
    futureRisk
  });

  // ================================
  // FINAL RESPONSE (LOCKED SHAPE)
  // ================================
  return {
    decision: authorityDecision.decision,          // RUN | PAUSE | STOP | SCALE
    confidence: authorityDecision.confidence,      // %
    risk: futureRisk.level,                         // LOW | MEDIUM | HIGH
    why: explanation.reasons,                       // array of strings
    moneyAdvice: actionGuidance.budgetAdvice,      // +20%, -30%, hold
    ifIgnored: futureRisk.ifIgnoredImpact           // ₹ loss estimate
  };
}

// ================================
// EARLY EXIT HANDLER
// ================================
function earlyExit({ decision, reason, ...signals }) {
  return {
    decision,
    confidence: 'Low',
    risk: 'HIGH',
    why: [reason],
    moneyAdvice: 'Do not increase budget',
    ifIgnored: 'High probability of loss',
    debug: signals // keep for logs, not UI
  };
}

module.exports = decisionOrchestrator;
