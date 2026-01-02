const express = require("express");
const app = express();

const adsRoutes = require("./routes/ads.routes");
const decisionRoutes = require("./routes/decision.routes");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/ads", adsRoutes);
app.use("/decision", decisionRoutes);

app.get("/", (req, res) => {
  res.send("Soullytics backend running");
});

app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
