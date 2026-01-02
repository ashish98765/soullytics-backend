const { createMetaAd } = require("../services/metaAds.service");
const { createGoogleAd } = require("../services/googleAds.service");

exports.createAd = async (req, res) => {
  const { platform, objective, budget } = req.body;

  let result;

  if (platform === "meta") {
    result = createMetaAd({ objective, budget });
  } else if (platform === "google") {
    result = createGoogleAd({ objective, budget });
  } else {
    return res.status(400).json({
      status: "error",
      message: "Unsupported platform"
    });
  }

  res.json({
    status: "success",
    engine: "ads",
    data: {
      objective,
      budget,
      ...result,
      createdAt: new Date().toISOString()
    }
  });
};
