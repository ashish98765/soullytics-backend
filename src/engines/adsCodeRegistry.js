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

      // ✅ CASE 1: module.exports = function(context){}
      if (typeof imported === "function") {
        registry[file.replace(".js", "")] = imported;
        return;
      }

      // ✅ CASE 2: module.exports = { SomeEngine }
      if (typeof imported === "object") {
        const exportedKey = Object.keys(imported)[0];
        registry[file.replace(".js", "")] = imported[exportedKey];
        return;
      }

      throw new Error("Invalid engine export type");

    } catch (err) {
      console.error(`❌ ${file} skipped: ${err.message}`);
    }
  });

  return registry;
}

module.exports = loadAdsCodes();
