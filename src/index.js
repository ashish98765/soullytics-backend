const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Soullytics backend is running");
});

// server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
