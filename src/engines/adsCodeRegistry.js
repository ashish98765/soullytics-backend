// src/engines/adsCodeRegistry.js

const fs = require("fs");
const path = require("path");

const registry = {};

function loadAdsCodes() {
  const enginesDir = __dirname;

  const files = fs.readdirSync(enginesDir);

  files.forEach((file) => {
    // sirf adsCode files
    if (!file.startsWith("adsCode")) return;
    if (!file.endsWith(".js")) return;

    const fullPath = path.join(enginesDir, file);

    try {
      const engine = require(fullPath);

      const engineName =
        engine.code ||
        engine.name ||
        file.replace(".js", "");

      registry[engineName] = engine;
    } catch (err) {
      console.error(`❌ Failed loading ${file}:`, err.message);
    }
  });

  return registry;
}

// Load once on boot
const adsCodeRegistry = loadAdsCodes();

module.exports = adsCodeRegistry;
