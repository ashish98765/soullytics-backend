// src/core/engineResult.js

/**
 * Standard response format for ALL engines in Soullytics
 */

function engineResult({
  engine,
  status,
  score = null,
  message,
  data = {}
}) {
  return {
    engine,              // engine name
    status,              // PASS | WARNING | FAIL
    score,               // 0.0 – 1.0 (confidence / risk)
    message,             // human-readable reason
    data,                // engine-specific output
    timestamp: new Date().toISOString()
  };
}

module.exports = { engineResult };
