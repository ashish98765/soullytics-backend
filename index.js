const express = require("express");
const app = express();

app.use(express.json());

// Routes
const decisionRoutes = require("./src/routes/decision.routes");

// Mount
app.use("/api", decisionRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Soullytics Backend is running");
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Soullytics backend running on port ${PORT}`);
});
