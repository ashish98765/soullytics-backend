const express = require("express");
const app = express();

// ===== Middleware =====
app.use(express.json({ limit: "2mb" }));

// ===== Health Check =====
app.get("/", (req, res) => {
  res.status(200).send("Soullytics Backend is LIVE 🚀");
});

// ===== Routes =====
const decisionRoutes = require("./src/routes/decision.routes");
app.use("/api/decision", decisionRoutes);

// ===== Global Error Handler =====
const errorHandler = require("./src/middleware/errorHandler");
app.use(errorHandler);

// ===== Server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Soullytics backend running on port ${PORT}`);
});
