const express = require("express");
const router = express.Router();

console.log("🔥 DECISION ROUTES LOADED");

/* =========================
   TEST ROUTE
========================= */
router.post("/test", (req, res) => {
  console.log("✅ /api/v1/test HIT");
  res.json({
    success: true,
    message: "Decision test route working",
    body: req.body
  });
});

module.exports = router;
