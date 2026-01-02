const express = require("express");
const healthRoutes = require("./routes/health.routes");
const adsRoutes = require("./routes/ads.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/ads", adsRoutes);
// test route
app.get("/", (req, res) => {
  res.send("Soullytics backend is running");
});

// server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
