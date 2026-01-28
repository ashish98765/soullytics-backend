const { engineResult } = require("../core/engineResult");

module.exports = function adsCode44(context = {}) {
  const { finalDecision = {}, meta = {} } = context;
  const { status, score = 0 } = finalDecision;

  const explanation = {
    decision: status,
    confidence: Math.round(score * 100) + "%",
    why: [],
    risks: [],
    protections: []
  };

  if (meta.failures?.length) {
    explanation.why.push(
      "Multiple high-authority engines failed. Capital protection enforced."
    );
  }

  if (meta.warnings?.length) {
    explanation.risks.push(
      "Warning signals may distort short-term performance."
    );
  }

  if (score > 0.7) {
    explanation.protections.push(
      "Decision backed by stable and reliable signals."
    );
  } else {
    explanation.protections.push(
      "Decision chosen to prevent loss under uncertainty."
    );
  }

  (meta.insights || []).forEach(i => {
    explanation.why.push(`[${i.engine}] ${i.message}`);
  });

  return engineResult({
    engine: "AdsCode44_Explainability",
    status: "PASS",
    impact: "HIGH",
    authority: 5,
    score,
    message: "Decision explanation generated.",
    explanation
  });
};
