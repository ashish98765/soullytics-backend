// src/core/learningEngine.js

/**
 * Hard safety clamp
 */
function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Learn behavioral bias from past decisions
 * history = [{ action, confidence, risk }]
 */
function learnFromHistory(history = []) {
  if (!Array.isArray(history) || history.length === 0) {
    return {
      confidenceBias: 0,
      riskBias: 0
    };
  }

  // last 20 decisions (more signal, still safe)
  const recent = history.slice(0, 20);

  let positive = 0;
  let negative = 0;

  recent.forEach(d => {
    if (d.action === "SCALE" || d.action === "RUN") positive++;
    if (d.action === "PAUSE" || d.action === "KILL") negative++;
  });

  /**
   * Bias logic:
   * - Confidence grows slowly
   * - Risk grows faster (safety first)
   */
  const confidenceBias = clamp((positive - negative) * 0.03, -0.25, 0.25);
  const riskBias = clamp(negative * 0.04, 0, 0.4);

  return { confidenceBias, riskBias };
}

/**
 * Apply learning bias to current decision
 */
function applyLearning(decision, history) {
  if (!decision) return decision;

  const { confidenceBias, riskBias } = learnFromHistory(history);

  return {
    ...decision,
    confidence: clamp((decision.confidence ?? 0.5) + confidenceBias),
    risk: clamp((decision.risk ?? 0) + riskBias)
  };
}

module.exports = {
  applyLearning
};
