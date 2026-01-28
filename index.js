const express = require("express");
const app = express();

/**
 * Middlewares
 */
app.use(express.json());

/**
 * Routes
 */
const decisionRoutes = require("./src/routes/decision.routes");
const analyticsRoutes = require("./src/routes/analytics.routes");

/**
 * Mount API routes
 */
app.use("/api", decisionRoutes);
app.use("/api", analyticsRoutes);

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Soullytics Backend is running 🚀");
});

/**
 * Server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Soullytics backend running on port ${PORT}`);
});
