// src/controllers/soullytics.controller.js

const { routeByMode } = require("../core/modeRouter");
const { runModeA } = require("../core/modeAFlow");
const { runModeB } = require("../core/modeBFlow");
const { runModeC } = require("../core/modeCFlow");
const { buildContext } = require("../core/contextBuilder");

async function handleSoullytics(req, res) {
  try {
    // 1️⃣ Basic request validation
    const { mode, payload } = req.body;

    if (!mode) {
      return res.status(400).json({
        error: "MODE_REQUIRED",
        message: "Mode is required (MODE_A / MODE_B / MODE_C)"
      });
    }

    // 2️⃣ Route by mode (allowed engines check)
    const modeConfig = routeByMode({ mode, payload });

    // 3️⃣ Build SAFE context (VERY IMPORTANT)
    const context = buildContext(payload || {});

    // 4️⃣ Execute correct flow
    let result;

    if (mode === "MODE_A") {
      result = await runModeA({
        adCreationEngines: context.adCreationEngines || [],
        context
      });
    }

    if (mode === "MODE_B") {
      result = await runModeB({
        adsCodes: context.adsCodes || [],
        context
      });
    }

    if (mode === "MODE_C") {
      result = await runModeC({
        adsCodes: context.adsCodes || [],
        adCreationEngines: context.adCreationEngines || [],
        context
      });
    }

    // 5️⃣ Final response
    return res.status(200).json({
      success: true,
      system: "SOULLYTICS",
      mode: modeConfig.mode,
      message: modeConfig.message,
      result
    });

  } catch (error) {
    console.error("SOULLYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "SOULLYTICS_RUNTIME_ERROR",
      message: error.message
    });
  }
}

module.exports = { handleSoullytics };
