module.exports = function intelligenceGate(decision, plan) {
  if (plan === "FREE") {
    return {
      action: decision.action,
      risk: decision.risk,
      confidence: Number(decision.confidence.toFixed(2)),
      explanation: "High-level decision based on current performance signals."
    };
  }

  if (plan === "PRO") {
    return {
      ...decision,
      trace: decision.trace?.slice(0, 3)
    };
  }

  if (plan === "AGENCY") {
    return decision;
  }

  if (plan === "ENTERPRISE") {
    return {
      ...decision,
      audit: {
        enginesUsed: decision.trace?.map(t => t.engine),
        generatedAt: new Date().toISOString()
      }
    };
  }

  return decision;
};
