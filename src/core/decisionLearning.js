// src/core/learningEngine.js

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Compute learning bias from recent decision history
 */
function computeLearningBias(history = []) {
  if (!Array.isArray(history) || history.length === 0) {
    return { confidenceBias: 0, riskBias: 0 };
  }

  const recent = history.slice(-10); // last 10 decisions

  let positive = 0;
  let negative = 0;

  recent.forEach(d => {
    if (d.action === "SCALE" || d.action === "RUN") positive++;
    if (d.action === "PAUSE" || d.action === "KILL") negative++;
  });

  return {
    confidenceBias: clamp((positive - negative) * 0.05, -0.2, 0.2),
    riskBias: clamp(negative * 0.03, 0, 0.3)
  };
}

/**
 * Apply learning bias to decision
 */
function applyLearning(decision, history = []) {
  const { confidenceBias, riskBias } = computeLearningBias(history);

  return {
    ...decision,
    confidence: clamp((decision.confidence || 0) + confidenceBias),
    risk: clamp((decision.risk || 0) + riskBias)
  };
}

module.exports = { applyLearning };
