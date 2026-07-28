const SavingsGoal = require('../models/SavingsGoal');

// @desc   Create new savings goal
// @route  POST /api/savings-goals
exports.createGoal = async (req, res) => {
  try {
    const { name, targetAmount, targetDate } = req.body;

    const goal = await SavingsGoal.create({
      user: req.user._id,
      name,
      targetAmount,
      targetDate,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get all savings goals for logged-in user
// @route  GET /api/savings-goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add a contribution to a goal
// @route  POST /api/savings-goals/:id/contribute
exports.contributeToGoal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Contribution amount must be greater than 0' });
    }

    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    goal.contributions.push({ amount });
    goal.savedAmount += amount;

    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update goal details (name, target amount, target date)
// @route  PUT /api/savings-goals/:id
exports.updateGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    const { name, targetAmount, targetDate } = req.body;
    if (name !== undefined) goal.name = name;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (targetDate !== undefined) goal.targetDate = targetDate;

    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete goal
// @route  DELETE /api/savings-goals/:id
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this goal' });
    }

    await goal.deleteOne();

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};