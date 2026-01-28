const { engineResult } = require("../core/engineResult");

module.exports = function adsCode19(context = {}) {
  const engineResults = context.engineResults || [];

  if (!Array.isArray(engineResults) || engineResults.length === 0) {
    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "DO_NOT_RUN",
      score: 0,
      message: "No engine results found."
    });
  }

  let weightedScore = 0;
  let authoritySum = 0;
  const failed = [];
  const warnings = [];

  for (const r of engineResults) {
    const authority = r.authority || 1;
    const score = typeof r.score === "number" ? r.score : 0;

    weightedScore += score * authority;
    authoritySum += authority;

    if (r.status === "FAIL") failed.push(r);
    if (r.status === "WARNING") warnings.push(r);
  }

  const confidence = authoritySum > 0 ? weightedScore / authoritySum : 0;

  const hardFail = failed.find(e => (e.authority || 1) >= 7);
  if (hardFail) {
    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "DO_NOT_RUN",
      score: Math.round(confidence * 100),
      message: `Blocked by ${hardFail.engine}`,
      meta: { confidence }
    });
  }

  if (warnings.length > 0) {
    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "PAUSE",
      score: Math.round(confidence * 100),
      message: "Risk signals detected. Human review required.",
      meta: { confidence }
    });
  }

  if (confidence >= 0.75) {
    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "SCALE",
      score: Math.round(confidence * 100),
      message: "High confidence. Scaling allowed.",
      meta: { confidence }
    });
  }

  return engineResult({
    engine: "AdsCode19_FinalComposer",
    status: "RUN",
    score: Math.round(confidence * 100),
    message: "Moderate confidence. Controlled execution.",
    meta: { confidence }
  });
};
