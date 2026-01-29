module.exports = function safeDecision(reason = "ENGINE_FAILURE") {
  return {
    action: "PAUSE",
    confidence: 0.2,
    risk: 0.9,
    reasons: [reason],
    trace: null,
  };
};
