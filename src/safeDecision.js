// src/safeDecision.js

module.exports = function safeDecision(reason = "ENGINE_FAILURE") {
  return {
    action: "PAUSE",
    confidence: 0,
    risk: 1,
    reasons: [
      {
        code: "SAFE_FALLBACK",
        message: "System entered safe mode due to an internal error.",
        detail: reason,
      },
    ],
    trace: [],
  };
};
