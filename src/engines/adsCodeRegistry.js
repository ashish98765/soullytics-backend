/**
 * Ads Engine Registry
 * -------------------
 * Dynamically loads all ad decision engines
 * and exposes them in a clean registry.
 *
 * Supports:
 * 1. module.exports = function engine()
 * 2. module.exports = { engineName: function }
 */

const fs = require("fs");
const path = require("path");

const registry = {};

function loadAdsEngines() {
  const enginesDir = __dirname;
  const files = fs.readdirSync(enginesDir);

  files.forEach((file) => {
    // ignore registry file itself
    if (file === "adsCodeRegistry.js") return;
    if (!file.endsWith(".js")) return;

    const enginePath = path.join(enginesDir, file);

    try {
      const imported = require(enginePath);
      const engineKey = file.replace(".js", "");

      // Case 1: module.exports = function
      if (typeof imported === "function") {
        registry[engineKey] = {
          name: engineKey,
          run: imported
        };
        return;
      }

      // Case 2: module.exports = { engineName: fn }
      if (typeof imported === "object" && imported !== null) {
        const fnKey = Object.keys(imported)[0];

        registry[engineKey] = {
          name: engineKey,
          run: imported[fnKey]
        };
        return;
      }

      throw new Error("Invalid engine export format");
    } catch (err) {
      console.error(`❌ Engine ${file} skipped: ${err.message}`);
    }
  });

  return registry;
}

module.exports = loadAdsEngines();
