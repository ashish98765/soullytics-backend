// src/core/dataFusionEngine.js

const adsCode00 = require('../engines/adsCode00.dataFusion');
const adsCode24 = require('../engines/adsCode24.signalQuality');
const adsCode35 = require('../engines/adsCode35.dataReliability');

async function dataFusionEngine(context = {}) {
  const signals = [];

  if (adsCode00) signals.push(adsCode00(context));
  if (adsCode24) signals.push(adsCode24(context));
  if (adsCode35) signals.push(adsCode35(context));

  return {
    trusted: signals.every(s => s?.status !== 'FAIL'),
    signals
  };
}

module.exports = dataFusionEngine;
