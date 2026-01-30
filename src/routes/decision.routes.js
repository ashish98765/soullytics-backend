const express = require("express");
const router = express.Router();

/* ======================
   TEST ROUTE
====================== */
router.post("/test", (req, res) => {
  console.log("✅ /api/v1/test HIT");
  res.json({
    success: true,
    message: "Decision test route working",
    body: req.body
  });
});

/* ======================
   MAIN DECISION ROUTE
====================== */
router.post("/decision", (req, res) => {
  const { metrics } = req.body;

  res.json({
    success: true,
    action: "RUN",
    confidence: 0.82,
    risk: 0.18,
    received_metrics: metrics || null
  });
});

module.exports = router;
