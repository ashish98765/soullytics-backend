// src/core/dataFusionEngine.js

const adsDataFusion = require('../engines/adsCode00.dataFusion');

const DataFusionEngine = {
  run(rawContext = {}) {
    const fused = adsDataFusion.run(rawContext);

    return {
      platform: fused.platform || rawContext.platform,
      metrics: fused.metrics || rawContext.metrics,
      history: fused.history || [],
      timestamp: Date.now(),
      source: 'dataFusionEngine'
    };
  }
};

module.exports = DataFusionEngine;
