module.exports = function computeRisk({ cpa, spend }, expectedCPA) {
  if (!cpa) return "High";

  if (cpa <= expectedCPA * 1.1) return "Low";
  if (cpa <= expectedCPA * 1.3) return "Medium";

  return "High";
};
