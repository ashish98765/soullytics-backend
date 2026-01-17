const adsCode00 = require("../engines/adsCode00.dataFusion");
const adsCode24 = require("../engines/adsCode24.signalQuality");
const adsCode35 = require("../engines/adsCode35.dataReliability");

async function dataFusionEngine(context = {}) {
  const results = [];

  if (adsCode00) results.push(adsCode00(context));
  if (adsCode24) results.push(adsCode24(context));
  if (adsCode35) results.push(adsCode35(context));

  return {
    trusted: results.every(r => r.status !== "FAIL"),
    results
  };
}

module.exports = dataFusionEngine;
