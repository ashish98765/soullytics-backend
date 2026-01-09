const { routeByMode } = require("../core/modeRouter");
const { runModeA } = require("../core/modeAFlow");
const { runModeB } = require("../core/modeBFlow");
const { runModeC } = require("../core/modeCFlow");

async function handleSoullytics(req, res) {
  try {
    const { mode, payload } = req.body;

    if (!mode) {
      throw new Error("mode is required");
    }

    const route = routeByMode({ mode, payload });

    let result;

    if (route.mode === "MODE_A") {
      result = await runModeA(payload || {});
    }

    if (route.mode === "MODE_B") {
      result = await runModeB(payload || {});
    }

    if (route.mode === "MODE_C") {
      result = await runModeC(payload || {});
    }

    res.json({ success: true, result });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}

module.exports = { handleSoullytics };
