// src/middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
}

module.exports = errorHandler;
