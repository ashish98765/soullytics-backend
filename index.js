const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Routes
const soullyticsRoutes = require("./src/routes/soullytics.routes");
const healthRoutes = require("./src/routes/health.routes");
const decisionRoutes = require("./src/routes/decision.routes");

// Mount routes
app.use("/health", healthRoutes);
app.use("/api", soullyticsRoutes);
app.use("/api", decisionRoutes);

// Root fallback
app.get("/", (req, res) => {
  res.send("Soullytics Backend is running");
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Soullytics backend running on port ${PORT}`);
});
