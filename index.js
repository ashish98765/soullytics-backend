const express = require("express");
const app = express();

// --------------------
// Middleware
// --------------------
app.use(express.json());

// --------------------
// Routes
// --------------------
const soullyticsRoutes = require("./src/routes/soullytics.routes");
const healthRoutes = require("./src/routes/health.routes");

// Health check (Render / monitoring)
app.use("/health", healthRoutes);

// Main API
app.use("/api", soullyticsRoutes);

// Root fallback
app.get("/", (req, res) => {
  res.send("Soullytics Backend is running");
});

// --------------------
// Server
// --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Soullytics backend running on port ${PORT}`);
});
