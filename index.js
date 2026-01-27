const express = require("express");
const app = express();

// ===== Middleware =====
app.use(express.json({ limit: "2mb" }));

// ===== Health Check =====
app.get("/", (req, res) => {
  res.status(200).send("Soullytics Backend is running");
});

// ===== Decision Orchestrator =====
const decisionOrchestrator = require("./src/core/decisionOrchestrator");

// POST /decision
app.post("/decision", async (req, res) => {
  try {
    const input = req.body || {};

    const result = await decisionOrchestrator(input);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Decision error:", err);

    res.status(500).json({
      success: false,
      error: err.message || "Decision engine crashed"
    });
  }
});

// ===== Server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Soullytics backend running on port ${PORT}`);
});
