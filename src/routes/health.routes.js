const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "soullytics-backend",
    message: "Soullytics backend is healthy",
    time: new Date().toISOString()
  });
});

module.exports = router;
