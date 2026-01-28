const { engineResult } = require("../core/engineResult");

module.exports = function adsCode45(context = {}) {
  const { memoryStore = [] } = context;

  if (memoryStore.length < 7) {
    return engineResult({
      engine: "AdsCode45_LearningMemory",
      status: "COLD",
      impact: "LOW",
      authority: 2,
      score: 0.2,
      message: "Insufficient historical memory data."
    });
  }

  const recent = memoryStore.slice(-15);

  const stats = {
    kill: recent.filter(r => r.decision === "KILL").length,
    scale: recent.filter(r => r.decision === "SCALE").length,
    pause: recent.filter(r => r.decision === "PAUSE").length
  };

  let systemBias = "BALANCED";
  if (stats.kill > stats.scale * 2) systemBias = "OVER_DEFENSIVE";
  if (stats.scale > stats.kill * 2) systemBias = "OVER_AGGRESSIVE";

  return engineResult({
    engine: "AdsCode45_LearningMemory",
    status: "ACTIVE",
    impact: "MEDIUM",
    authority: 3,
    score: 0.6,
    message: "Learning bias evaluated.",
    bias: systemBias,
    recommendation:
      systemBias === "OVER_DEFENSIVE"
        ? "Reduce fear bias. Allow controlled scaling."
        : systemBias === "OVER_AGGRESSIVE"
        ? "Increase capital protection sensitivity."
        : "System behavior stable."
  });
};
