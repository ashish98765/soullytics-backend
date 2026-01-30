module.exports = function computeDecision({ confidence, risk }) {
  if (confidence === "High" && risk === "Low") return "SCALE";
  if (risk === "High") return "PAUSE";
  return "RUN";
};
