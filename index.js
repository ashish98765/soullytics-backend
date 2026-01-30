const express = require("express");
const app = express;

/* ======================
   Core Middlewares
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   Health Check (ROOT)
====================== */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "soullytics-backend",
    time: new Date().toISOString()
  });
});

/* ======================
   Routes
====================== */
const decisionRoutes = require("./src/routes/decision.routes");

app.use("/api/v1", decisionRoutes);

/* ======================
   Server Boot
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Soullytics backend running on port ${PORT}`);
});
