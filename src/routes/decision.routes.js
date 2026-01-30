const express = require("express");
const router = express.Router();

router.post("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.json({
    ok: true,
    body: req.body
  });
});

module.exports = router;
