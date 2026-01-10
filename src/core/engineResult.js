// src/core/engineResult.js

function engineResult({
  engine,
  status,
  score = null,
  impact = "MEDIUM", // LOW | MEDIUM | HIGH
  authority = 1,     // 1 (weak) → 5 (critical)
  message,
  data = {}
}) {
  return {
    engine,
    status,       // PASS | WARNING | FAIL
    score,        // numeric influence
    impact,       // used by FinalComposer
    authority,    // hierarchy power
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

module.exports = { engineResult };
