const express = require("express");
const app = express();

const soullyticsRoutes = require("./src/routes/soullytics.routes");
const healthRoutes = require("./src/routes/health.routes");

const PORT = process.env.PORT || 5000;

app.use(express.json());

// API routes
app.use("/api/v1", soullyticsRoutes);

// Health check
app.use("/", healthRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Soullytics backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
