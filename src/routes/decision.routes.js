const express = require("express");
const app = express();

console.log("🔥 INDEX.JS LOADED");

app.use(express.json());

const decisionRoutes = require("./src/routes/decision.routes");

app.use("/api/v1", decisionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
