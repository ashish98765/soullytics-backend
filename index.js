const express = require("express");
const app = express();

app.use(express.json());

/* Routes */
const decisionRoutes = require("./src/routes/decision.routes");
const healthRoutes = require("./src/routes/health.routes");

/* API Versioning */
app.use("/api/v1", decisionRoutes);
app.use("/health", healthRoutes);

/* Global Error Handler */
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Soullytics backend running on port ${PORT}`);
});
