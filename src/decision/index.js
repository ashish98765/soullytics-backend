const evaluateDecision = require("./evaluators/evaluateDecision");

module.exports = function runDecisionEngine(payload) {
  const result = evaluateDecision(payload);

  // 🔥 Strip internal decision before sending to frontend
  delete result.__internal;

  return result;
};
