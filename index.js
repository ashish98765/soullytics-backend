const express = require("express");
const app = express();

const requestContext = require("./src/middlewares/requestContext");
const rateLimit = require("./src/middlewares/rateLimit");
const errorHandler = require("./src/middlewares/errorHandler");

const decisionRoutes = require("./src/routes/decision.routes");
const systemRoutes = require("./src/routes/system.routes");

app.use(express.json({ limit: "1mb" }));
app.use(requestContext);
app.use(rateLimit);

app.use("/api", decisionRoutes);
app.use("/system", systemRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Soullytics running on port ${PORT}`)
);
