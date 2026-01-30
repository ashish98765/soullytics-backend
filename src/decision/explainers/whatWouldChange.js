module.exports = function whatWouldChange({ cpa, volume }, expectedCPA) {
  const changes = [];

  if (cpa && cpa > expectedCPA * 1.2) {
    changes.push("Reducing CPA by 20% would lower risk.");
  }

  if (volume < 50) {
    changes.push("Increasing conversion volume would improve confidence.");
  }

  return changes.length
    ? changes
    : ["No immediate changes required to improve decision clarity."];
};
