const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Routes
const soullyticsRoutes = require("./src/routes/soullytics.routes");
const healthRoutes = require("./src/routes/health.routes");

// Mount routes
app.use("/", soullyticsRoutes);
app.use("/", healthRoutes);

// Default fallback
app.get("/", (req, res) => {
  res.send("Soullytics Backend is running");
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Soullytics backend running on port ${PORT}`);
});
