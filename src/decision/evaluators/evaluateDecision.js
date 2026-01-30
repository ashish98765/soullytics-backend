const computeConfidence = require("../rules/confidence.rules");
const computeRisk = require("../rules/risk.rules");
const computeDecision = require("../rules/decision.rules");
const buildExplanation = require("../explainers/explanation.builder");
const whatWouldChange = require("../explainers/whatWouldChange");

module.exports = function evaluateDecision({ aggregated, expectedCPA }) {
  const confidence = computeConfidence(aggregated);
  const risk = computeRisk(aggregated, expectedCPA);
  const internalDecision = computeDecision({ confidence, risk });

  return {
    confidence,
    risk,
    explanation: buildExplanation({
      confidence,
      risk,
      metrics: aggregated
    }),
    whatWouldChange: whatWouldChange(aggregated, expectedCPA),
    __internal: {
      decision: internalDecision
    }
  };
};
