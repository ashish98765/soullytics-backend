const express = require("express");
const app = express();

/* ================================
   Core Middlewares
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   Routes
================================ */
const decisionRoutes = require("./src/routes/decision.routes");
const healthRoutes = require("./src/routes/health.routes");
const csvRoutes = require("./src/routes/csv.routes");

/* ================================
   API Versioning
================================ */
app.use("/api/v1/decision", decisionRoutes);
app.use("/api/v1/csv", csvRoutes);
app.use("/health", healthRoutes);

/* ================================
   Global Error Handler
================================ */
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

/* ================================
   Server Boot
================================ */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Soullytics backend running on port ${PORT}`);
});
