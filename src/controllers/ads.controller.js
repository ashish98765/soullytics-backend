// src/controllers/ads.controller.js

exports.createAd = async (req, res) => {
  try {
    res.json({
      message: "Ad creation engine connected",
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      error: "Ad creation failed"
    });
  }
};
