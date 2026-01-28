// src/core/reasonGenerator.js

function generateReasons(trace = {}) {
  const reasons = [];

  if (!trace.engines || !Array.isArray(trace.engines)) return reasons;

  trace.engines.forEach(engine => {
    if (engine.severity === "HIGH") {
      reasons.push(`Critical issue in ${engine.group}: ${engine.message}`);
    }

    if (engine.severity === "MEDIUM") {
      reasons.push(`Warning in ${engine.group}: ${engine.message}`);
    }
  });

  // fallback
  if (reasons.length === 0) {
    reasons.push("No critical issues detected. Decision based on overall performance.");
  }

  return reasons.slice(0, 3); // frontend friendly
}

module.exports = generateReasons;
