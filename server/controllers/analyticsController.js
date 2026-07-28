const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// @desc   Get monthly analytics (spending by category, total, avg daily)
// @route  GET /api/analytics/monthly?month=6&year=2026
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalExpense = categoryBreakdown.reduce((sum, c) => sum + c.total, 0);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const avgDailySpending = totalExpense / daysInMonth;

    const highestCategory = categoryBreakdown[0] || null;
    const lowestCategory = categoryBreakdown[categoryBreakdown.length - 1] || null;

    res.status(200).json({
      month,
      year,
      totalExpense,
      avgDailySpending: Math.round(avgDailySpending * 100) / 100,
      categoryBreakdown,
      highestSpendingCategory: highestCategory,
      lowestSpendingCategory: lowestCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Income vs Expense for a given month
// @route  GET /api/analytics/income-vs-expense?month=6&year=2026
exports.getIncomeVsExpense = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const [expenseResult] = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const [incomeResult] = await Income.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalExpense = expenseResult?.total || 0;
    const totalIncome = incomeResult?.total || 0;

    res.status(200).json({
      month,
      year,
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      savingsRate: totalIncome > 0
        ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
        : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Compare current month vs previous month spending
// @route  GET /api/analytics/monthly-comparison?month=6&year=2026
exports.getMonthlyComparison = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const getTotalForMonth = async (m, y) => {
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 1);
      const [result] = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      return result?.total || 0;
    };

    const [currentTotal, previousTotal] = await Promise.all([
      getTotalForMonth(month, year),
      getTotalForMonth(prevMonth, prevYear),
    ]);

    const change = previousTotal > 0
      ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
      : null;

    res.status(200).json({
      currentMonthTotal: currentTotal,
      previousMonthTotal: previousTotal,
      percentChange: change,
      trend: change === null ? 'no-data' : change > 0 ? 'increase' : change < 0 ? 'decrease' : 'same',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Yearly analytics — spending totals grouped by month
// @route  GET /api/analytics/yearly?year=2026
exports.getYearlyAnalytics = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const monthlyBreakdown = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ year, monthlyBreakdown });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};