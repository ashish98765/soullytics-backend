// src/controllers/soullytics.controller.js

const { buildContext } = require("../core/contextBuilder");
const { routeByMode, MODES } = require("../core/modeRouter");

const { runModeA } = require("../core/modeAFlow");
const { runModeB } = require("../core/modeBFlow");
const { runModeC } = require("../core/modeCFlow");

async function handleSoullytics(req, res) {
  try {
    // 1. Read input
    const input = req.body || {};

    // 2. Build normalized context
    const context = buildContext(input);

    // 3. Decide mode routing
    const routing = routeByMode({
      mode: context.mode,
      payload: context
    });

    let result;

    // 4. Execute mode
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

    // 5. Respond
    return res.status(200).json(result);

  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

module.exports = {
  handleSoullytics
};
