const { randomUUID } = require("crypto");

module.exports = (req, res, next) => {
  req.traceId = randomUUID();
  res.setHeader("X-Trace-Id", req.traceId);

  console.log("➡️ REQUEST", {
    traceId: req.traceId,
    method: req.method,
    path: req.originalUrl
  });

  next();
};
