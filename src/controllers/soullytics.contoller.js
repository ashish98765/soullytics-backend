// src/controllers/soullytics.controller.js

const { buildContext } = require("../core/contextBuilder");
const { routeByMode, MODES } = require("../core/modeRouter");
const { runModeA } = require("../core/modeAFlow");
const { runModeB } = require("../core/modeBFlow");
const { runModeC } = require("../core/modeCFlow");

async function handleSoullytics(req, res) {
  try {
    const input = req.body;

    const context = buildContext(input);
    const routing = routeByMode({
      mode: context.mode,
      payload: context
    });

    let result;

    switch (routing.mode) {
      case MODES.MODE_A:
        result = await runModeA({ context });
        break;

      case MODES.MODE_B:
        result = await runModeB({ context });
        break;

      case MODES.MODE_C:
        result = await runModeC({
          adsCodes: [],
          adCreationEngines: [],
          context
        });
        break;

      default:
        throw new Error("Invalid mode");
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
}

module.exports = { handleSoullytics };
