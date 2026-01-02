exports.createAd = async (req, res) => {
  try {
    const { platform, objective, budget, creatives } = req.body;

    // 1️⃣ Validation
    if (!platform || !objective) {
      return res.status(400).json({
        status: "error",
        message: "platform and objective are required"
      });
    }

    if (budget !== undefined && budget <= 0) {
      return res.status(400).json({
        status: "error",
        message: "budget must be greater than 0"
      });
    }

    // 2️⃣ Normalized input
    const adPayload = {
      platform,
      objective,
      budget: budget || null,
      creatives: creatives || [],
      createdAt: new Date().toISOString()
    };

    // 3️⃣ Platform Brain
    let engineConfig = {};

    if (platform === "meta") {
      engineConfig = {
        engine: "META_ENGINE",
        campaignType: objective === "leads" ? "LEAD_GEN" : "AWARENESS",
        placements: ["facebook", "instagram"]
      };
    }

    if (platform === "google") {
      engineConfig = {
        engine: "GOOGLE_ENGINE",
        campaignType: objective === "leads" ? "SEARCH" : "DISPLAY",
        placements: ["search", "youtube"]
      };
    }

    if (!engineConfig.engine) {
      return res.status(400).json({
        status: "error",
        message: "unsupported platform"
      });
    }

    // 4️⃣ Final response
    res.status(200).json({
      status: "success",
      message: "Ad processed by Soullytics platform brain",
      data: {
        ad: adPayload,
        engine: engineConfig,
        nextStep: "creative-generation"
      }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ad processing failed",
      error: error.message
    });
  }
};
