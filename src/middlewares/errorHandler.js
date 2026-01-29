module.exports = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
  });
};
