const express = require("express");
const app = express;

/* =========================
   Middlewares
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🔥 INDEX.JS LOADED");

/* =========================
   Routes
========================= */
const decisionRoutes = require("./src/routes/decision.routes");

app.use("/api/v1", decisionRoutes);

/* =========================
   Health Check
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "soullytics-backend"
  });
});

/* =========================
   Server Boot
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
