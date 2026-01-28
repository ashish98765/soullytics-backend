// src/core/learningEngine.js

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Compute learning bias from past decisions
 */
function computeLearningBias(history = []) {
  if (!history.length) {
    return { confidenceBias: 0, riskBias: 0 };
  }

  const recent = history.slice(-10); // last 10 decisions

  let positive = 0;
  let negative = 0;

  recent.forEach(d => {
    if (d.action === "SCALE" || d.action === "RUN") positive++;
    if (d.action === "PAUSE" || d.action === "KILL") negative++;
  });

  const confidenceBias = clamp((positive - negative) * 0.05, -0.2, 0.2);
  const riskBias = clamp(negative * 0.03, 0, 0.3);

  return { confidenceBias, riskBias };
}

function applyLearning(decision, history) {
  const { confidenceBias, riskBias } = computeLearningBias(history);

  return {
    ...decision,
    confidence: clamp(decision.confidence + confidenceBias),
    risk: clamp(decision.risk + riskBias)
  };
}

module.exports = { applyLearning };
