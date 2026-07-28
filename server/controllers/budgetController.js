const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc   Create budget
// @route  POST /api/budgets
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      month,
      year,
    });

    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: `A budget for ${req.body.category} already exists for this month`,
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get all budgets for a given month/year, with spending progress
// @route  GET /api/budgets?month=6&year=2026
exports.getBudgets = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const budgets = await Budget.find({ user: req.user._id, month, year });

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Expense.find({
          user: req.user._id,
          category: budget.category,
          date: { $gte: startDate, $lt: endDate },
        });

        const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const percentUsed = Math.round((spent / budget.amount) * 100);

        return {
          ...budget.toObject(),
          spent,
          remaining: budget.amount - spent,
          percentUsed,
        };
      })
    );

    res.status(200).json(budgetsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update budget
// @route  PUT /api/budgets/:id
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this budget' });
    }

    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete budget
// @route  DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this budget' });
    }

    await budget.deleteOne();

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};