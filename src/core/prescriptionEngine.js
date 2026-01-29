function buildPrescription({ action, confidence, risk, dominantFactor }) {
  const fix = [];
  const next = [];

  if (dominantFactor === "CREATIVE") {
    fix.push("Creative fatigue detected");
    next.push("Rotate creatives within 48 hours");
  }

  if (dominantFactor === "AUDIENCE") {
    fix.push("Audience mismatch or overlap");
    next.push("Refine interest or intent targeting");
  }

  if (risk > 0.6) {
    fix.push("High delivery or compliance risk");
    next.push("Lower budget and stabilize performance");
  }

  return {
    summary:
      action === "SCALE"
        ? "Performance strong. Safe to scale."
        : action === "PAUSE"
        ? "Risk signals detected. Pause recommended."
        : "Critical failure detected.",
    what_to_fix_now: fix,
    what_to_try_next: next,
    expected_impact: `Confidence ${(confidence * 100).toFixed(1)}%, Risk ${(risk * 100).toFixed(1)}%`
  };
}

module.exports = buildPrescription;
