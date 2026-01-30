/**
 * Converts raw metrics into a normalized impact score (-1 to +1)
 * Positive = capital gain, Negative = capital damage
 */
module.exports = function outcomeImpact(outcome = {}) {
  const { roas, cpa, ctr } = outcome;

  let score = 0;

  if (typeof roas === "number") {
    if (roas >= 2) score += 0.6;
    else if (roas >= 1) score += 0.2;
    else score -= 0.4;
  }

  if (typeof cpa === "number") {
    if (cpa < 400) score += 0.3;
    else if (cpa > 800) score -= 0.3;
  }

  if (typeof ctr === "number") {
    if (ctr > 2) score += 0.1;
    else if (ctr < 0.5) score -= 0.1;
  }

  return Math.max(-1, Math.min(1, score));
};
