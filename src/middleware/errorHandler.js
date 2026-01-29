module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";

  console.error("❌ ERROR", {
    code,
    status,
    message: err.message,
    path: req.originalUrl,
    traceId: req.traceId
  });

  res.status(status).json({
    success: false,
    error: code,
    message: err.message || "Something went wrong",
    traceId: req.traceId
  });
};
