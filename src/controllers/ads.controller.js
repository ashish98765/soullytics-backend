// src/controllers/ads.controller.js

const { generateCreative } = require("../engines/creative.engine");

exports.createAd = async (req, res) => {
  try {
    const { platform, objective, budget } = req.body;

    if (!platform || !objective) {
      return res.status(400).json({
        status: "error",
        message: "platform and objective are required",
      });
    }

    // 🧠 AI Brain call
    const creative = generateCreative({ platform, objective });

    res.json({
      status: "success",
      message: "Ad created using creative engine",
      data: {
        platform,
        objective,
        budget: budget || null,
        creative,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ad creation failed",
    });
  }
};
