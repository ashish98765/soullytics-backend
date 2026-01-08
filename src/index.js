// src/index.js

const express = require("express");
const app = express();

const soullyticsRoutes = require("./routes/soullytics.routes");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1", soullyticsRoutes);

app.get("/", (req, res) => {
  res.send("Soullytics backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
