// index.js (ROOT)

const express = require("express");
const app = express();

// Routes
const soullyticsRoutes = require("./src/routes/soullytics.routes");
const healthRoutes = require("./src/routes/health.routes");

const PORT = process.env.PORT || 5000;

app.use(express.json());

// Health check
app.use("/health", healthRoutes);

// Main API
app.use("/api/v1", soullyticsRoutes);

// Root check
app.get("/", (req, res) => {
  res.send("SOULLYTICS backend running");
});

app.listen(PORT, () => {
  console.log(`SOULLYTICS server running on port ${PORT}`);
});
