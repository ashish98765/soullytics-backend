// src/engines/adsCodeRegistry.js

const fs = require("fs");
const path = require("path");

const registry = {};

function loadAdsCodes() {
  const enginesDir = __dirname;
  const files = fs.readdirSync(enginesDir);

  files.forEach((file) => {
    if (!file.startsWith("adsCode")) return;
    if (!file.endsWith(".js")) return;

    const fullPath = path.join(enginesDir, file);

    try {
      const imported = require(fullPath);

      // Case 1: module.exports = function
      if (typeof imported === "function") {
        registry[file.replace(".js", "")] = imported;
        return;
      }

      // Case 2: module.exports = { engineName: fn }
      if (typeof imported === "object" && imported !== null) {
        const key = Object.keys(imported)[0];
        registry[file.replace(".js", "")] = imported[key];
        return;
      }

      throw new Error("Invalid engine export");
    } catch (err) {
      console.error(`❌ Engine ${file} skipped: ${err.message}`);
    }
  });

  return registry;
}

module.exports = loadAdsCodes();
