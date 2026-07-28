const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');

router.use(protect);

router.route('/').post(createIncome).get(getIncomes);
router.route('/:id').get(getIncomeById).put(updateIncome).delete(deleteIncome);

module.exports = router;