const express = require("express");
const router = express.Router();

// Ads creation (basic)
router.post("/create", (req, res) => {
  const { platform, objective, budget, creatives } = req.body;

  if (!platform || !objective) {
    return res.status(400).json({
      status: "error",
      message: "platform and objective are required",
    });
  }

  res.json({
    status: "success",
    message: "Ad creation request received",
    data: {
      platform,
      objective,
      budget: budget || null,
      creatives: creatives || [],
      createdAt: new Date().toISOString(),
    },
  });
});

module.exports = router;
