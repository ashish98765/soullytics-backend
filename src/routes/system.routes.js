const router = require("express").Router();

router.get("/health", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

router.get("/ready", (_, res) => {
  res.json({ ready: true });
});

router.get("/metrics", (_, res) => {
  res.json({
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

module.exports = router;
