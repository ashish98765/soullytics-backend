const express = require("express");
const app = express();

// middleware
app.use(express.json());

// routes
const adsRoutes = require("./routes/ads.routes");
const decisionRoutes = require("./routes/decision.routes");

app.use("/ads", adsRoutes);
app.use("/decision", decisionRoutes);

// root
app.get("/", (req, res) => {
  res.send("Soullytics backend running");
});

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
