exports.decide = (req, res) => {
  const { goal, budget } = req.body;

  if (!goal || !budget) {
    return res.status(400).json({
      status: "error",
      message: "goal and budget required"
    });
  }

  let platform = "meta";
  if (budget >= 1000) platform = "google";

  res.json({
    status: "success",
    engine: "decision",
    decision: {
      goal,
      budget,
      platform
    }
  });
};
