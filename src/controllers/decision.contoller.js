exports.decide = async (req, res) => {
  try {
    const { goal, budget } = req.body;

    if (!goal || !budget) {
      return res.status(400).json({
        status: "error",
        message: "goal and budget required"
      });
    }

    res.json({
      status: "success",
      engine: "decision",
      decision: {
        recommendedPlatform: "meta",
        objective: goal,
        dailyBudget: budget
      }
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "decision engine failed"
    });
  }
};
