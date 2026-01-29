// src/core/learningEngine.js

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Learn bias from last N decisions.
 * history items shape:
 * { action, confidence, risk, created_at }
 */
function learnFromHistory(history = []) {
  if (!Array.isArray(history) || history.length === 0) {
    return { confidenceBias: 0, riskBias: 0 };
  }

  // Use last 20 decisions (time-decayed by recency)
  const recent = history.slice(0, 20);

  let pos = 0;
  let neg = 0;
  let weight = 1;

  for (const d of recent) {
    if (d.action === "SCALE" || d.action === "RUN") pos += weight;
    if (d.action === "PAUSE" || d.action === "KILL") neg += weight;
    weight *= 0.92; // time decay
  }

  // Conservative: confidence grows slowly, risk grows faster
  const confidenceBias = clamp((pos - neg) * 0.03, -0.25, 0.25);
  const riskBias = clamp(neg * 0.04, 0, 0.4);

  return { confidenceBias, riskBias };
}

function applyLearning(decision, history) {
  if (!decision) return decision;

  const { confidenceBias, riskBias } = learnFromHistory(history);

  return {
    ...decision,
    confidence: clamp((decision.confidence ?? 0.5) + confidenceBias),
    risk: clamp((decision.risk ?? 0) + riskBias)
  };
}

module.exports = { applyLearning };
