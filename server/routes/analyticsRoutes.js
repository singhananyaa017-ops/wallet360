const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMonthlyAnalytics,
  getIncomeVsExpense,
  getMonthlyComparison,
  getYearlyAnalytics,
} = require('../controllers/analyticsController');

router.use(protect);

router.get('/monthly', getMonthlyAnalytics);
router.get('/income-vs-expense', getIncomeVsExpense);
router.get('/monthly-comparison', getMonthlyComparison);
router.get('/yearly', getYearlyAnalytics);

module.exports = router;