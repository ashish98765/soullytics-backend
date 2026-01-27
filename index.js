const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soullytics Backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Soullytics backend running on port", PORT);
});
