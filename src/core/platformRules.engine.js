// src/core/platformRules.engine.js

const { adsCode03, adsCode10 } = require("../engines/adsCodeRegistry");

function run(context = {}) {
  const platformSelection = adsCode03.run(context);
  const platformRules = adsCode10.run(context);

  return {
    allowed:
      platformSelection.status !== "FAIL" &&
      platformRules.status !== "FAIL",
    platformSelection,
    platformRules
  };
}

module.exports = { run };
