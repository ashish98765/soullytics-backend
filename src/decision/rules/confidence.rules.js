module.exports = function computeConfidence({ volume, ctr }) {
  if (volume >= 50 && ctr >= 1.5) return "High";
  if (volume >= 20) return "Medium";
  return "Low";
};
