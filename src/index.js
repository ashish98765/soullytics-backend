const express = require("express");
const app = express();

// routes import
const adsRoutes = require("./routes/ads.routes");

// port
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

// routes connect
app.use("/ads", adsRoutes);

// root check
app.get("/", (req, res) => {
  res.send("Soullytics backend running");
});

// server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
