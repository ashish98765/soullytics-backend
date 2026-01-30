/**
 * Decision Orchestrator
 * ---------------------
 * Ye file Soullytics ka MAIN BRAIN hai.
 * Yahin se:
 * - saare AdsCode engines call hote hain
 * - confidence + risk aggregate hota hai
 * - learning engine hook hota hai
 * - final decision banti hai (RUN / PAUSE / KILL / SCALE)
 */

const adsRegistry = require("../engines/adsRegistry");
const { learn } = require("../intelligence/learningEngine");

function decisionOrchestrator(input) {
  const { metrics = {}, context = {} } = input;

  const trace = [];
  let confidenceSum = 0;
  let riskSum = 0;
  let executed = 0;

  /* ============================
     1. RUN ALL REGISTERED ENGINES
  ============================ */
  for (const engine of adsRegistry) {
    try {
      const result = engine(metrics, context);

      trace.push({
        engine: engine.name,
        confidence: result.confidence,
        risk: result.risk,
        reason: result.reason || null
      });

      confidenceSum += result.confidence;
      riskSum += result.risk;
      executed++;
    } catch (err) {
      trace.push({
        engine: engine.name,
        error: err.message
      });
    }
  }

  /* ============================
     2. AGGREGATION
  ============================ */
  const avgConfidence =
    executed > 0 ? confidenceSum / executed : 0;

  const avgRisk =
    executed > 0 ? riskSum / executed : 0;

  /* ============================
     3. DECISION LOGIC (INTERNAL)
  ============================ */
  let action = "RUN";

  if (avgRisk > 0.75) action = "KILL";
  else if (avgRisk > 0.55) action = "PAUSE";
  else if (avgConfidence > 0.75 && avgRisk < 0.35)
    action = "SCALE";

  /* ============================
     4. CONFIDENCE CALIBRATION
  ============================ */
  const calibratedConfidence = Math.max(
    0,
    Math.min(1, avgConfidence - avgRisk * 0.3)
  );

  /* ============================
     5. LEARNING HOOK
  ============================ */
  const learning = learn({
    metrics,
    decision: action,
    outcome: context.outcome || null
  });

  /* ============================
     6. FINAL RESPONSE (NO UI ACTIONS)
  ============================ */
  return {
    decision: {
      internal_action: action,
      confidence: Number(calibratedConfidence.toFixed(2)),
      risk: Number(avgRisk.toFixed(2))
    },
    learning,
    trace
  };
}

module.exports = decisionOrchestrator;
