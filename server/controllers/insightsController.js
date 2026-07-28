const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const getCategoryTotalsForMonth = async (userId, month, year) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  const results = await Expense.aggregate([
    { $match: { user: userId, date: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);

  const totals = {};
  results.forEach((r) => {
    totals[r._id] = r.total;
  });
  return totals;
};

// @desc   Generate smart spending insights for a given month
// @route  GET /api/insights?month=6&year=2026
exports.getInsights = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const [currentTotals, prevTotals, budgets] = await Promise.all([
      getCategoryTotalsForMonth(userId, month, year),
      getCategoryTotalsForMonth(userId, prevMonth, prevYear),
      Budget.find({ user: userId, month, year }),
    ]);

    const insights = [];

    // Insight type 1: category spending change vs. previous month
    Object.keys(currentTotals).forEach((category) => {
      const current = currentTotals[category];
      const previous = prevTotals[category];

      if (previous && previous > 0) {
        const percentChange = Math.round(((current - previous) / previous) * 100);

        if (Math.abs(percentChange) >= 10) {
          insights.push({
            type: percentChange > 0 ? 'warning' : 'positive',
            message:
              percentChange > 0
                ? `You spent ${percentChange}% more on ${category} this month.`
                : `${category} expenses decreased by ${Math.abs(percentChange)}%.`,
          });
        }
      } else if (current > 0 && !previous) {
        insights.push({
          type: 'neutral',
          message: `You started spending on ${category} this month (₹${current}).`,
        });
      }
    });

    // Insight type 2: categories that disappeared entirely
    Object.keys(prevTotals).forEach((category) => {
      if (!currentTotals[category]) {
        insights.push({
          type: 'positive',
          message: `No spending on ${category} this month, compared to ₹${prevTotals[category]} last month.`,
        });
      }
    });

    // Insight type 3: budget exceeded
    budgets.forEach((budget) => {
      const spent = currentTotals[budget.category] || 0;
      if (spent > budget.amount) {
        insights.push({
          type: 'danger',
          message: `${budget.category} exceeded budget by ₹${spent - budget.amount}.`,
        });
      } else if (spent >= budget.amount * 0.8) {
        insights.push({
          type: 'warning',
          message: `${budget.category} is at ${Math.round((spent / budget.amount) * 100)}% of its budget.`,
        });
      }
    });

    // Insight type 4: consistent spending (within 5% for 2 months running)
    Object.keys(currentTotals).forEach((category) => {
      const current = currentTotals[category];
      const previous = prevTotals[category];
      if (previous && previous > 0) {
        const percentChange = Math.abs(((current - previous) / previous) * 100);
        if (percentChange < 5) {
          insights.push({
            type: 'neutral',
            message: `${category} spending remained consistent with last month.`,
          });
        }
      }
    });

    if (insights.length === 0) {
      insights.push({
        type: 'neutral',
        message: 'Not enough data yet to generate insights — keep tracking your expenses!',
      });
    }

    res.status(200).json({ month, year, insights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};