exports.createAd = async (req, res) => {
  try {
    const { platform, objective, budget, creatives } = req.body;

    // 1️⃣ basic validation
    if (!platform || !objective) {
      return res.status(400).json({
        status: "error",
        message: "platform and objective are required"
      });
    }

    if (budget && budget <= 0) {
      return res.status(400).json({
        status: "error",
        message: "budget must be greater than 0"
      });
    }

    // 2️⃣ validated ad payload
    const adPayload = {
      platform,
      objective,
      budget: budget || null,
      creatives: creatives || [],
      createdAt: new Date().toISOString()
    };

    // 3️⃣ success response
    res.status(200).json({
      status: "success",
      message: "Ad validated successfully",
      data: adPayload
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ad creation failed",
      error: error.message
    });
  }
};
