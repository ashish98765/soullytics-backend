const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { uploadCSV } = require("../controllers/csv.controller");

router.post(
  "/upload",
  upload.single("file"),
  uploadCSV
);

module.exports = router;
