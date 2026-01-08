// src/core/modeRouter.js

const MODES = {
  MODE_A: "MODE_A", // Ad creation only
  MODE_B: "MODE_B", // Analyze & decide (data-based)
  MODE_C: "MODE_C"  // Decision first, then execution
};

function routeByMode({ mode, payload }) {
  if (!mode) {
    throw new Error("Mode is required");
  }

  switch (mode) {
    case MODES.MODE_A:
      return {
        mode: MODES.MODE_A,
        allowedEngines: ["AD_CREATION"],
        message: "Ad creation mode activated"
      };

    case MODES.MODE_B:
      return {
        mode: MODES.MODE_B,
        allowedEngines: ["DECISION", "ANALYSIS"],
        message: "Analysis & decision mode activated"
      };

    case MODES.MODE_C:
      return {
        mode: MODES.MODE_C,
        allowedEngines: ["DECISION", "AD_CREATION", "FEEDBACK"],
        message: "Full autonomous mode activated"
      };

    default:
      throw new Error("Invalid mode");
  }
}

module.exports = {
  MODES,
  routeByMode
};
