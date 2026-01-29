module.exports = function validateDecision(req, res, next) {
  const { email, platform, raw } = req.body;

  if (!email || !email.includes("@")) {
    return next({
      status: 400,
      code: "INVALID_EMAIL",
      message: "Valid email required"
    });
  }

  if (!platform || typeof raw !== "object") {
    return next({
      status: 400,
      code: "INVALID_PAYLOAD",
      message: "Platform and raw data required"
    });
  }

  next();
};
