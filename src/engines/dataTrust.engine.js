// src/engines/dataTrust.engine.js

module.exports = {
  async run(context) {
    const impressions = context?.impressions || 0;

    if (impressions < 100) {
      return {
        trusted: false,
        reason: "Insufficient data volume"
      };
    }

    return {
      trusted: true,
      reason: "Data volume sufficient"
    };
  }
};
