const { parseCSV } = require("../services/csvParser.service");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "CSV_FILE_REQUIRED",
      });
    }

    const { platform } = req.body;

    if (!platform) {
      return res.status(400).json({
        success: false,
        error: "PLATFORM_REQUIRED",
      });
    }

    const rows = await parseCSV(req.file.buffer);

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        error: "EMPTY_CSV",
      });
    }

    return res.json({
      success: true,
      platform,
      rowCount: rows.length,
      preview: rows.slice(0, 5), // sirf preview
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "CSV_PARSE_FAILED",
      message: err.message,
    });
  }
};
