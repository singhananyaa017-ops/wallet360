const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createGoal,
  getGoals,
  contributeToGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/savingsGoalController');

router.use(protect);

router.route('/').post(createGoal).get(getGoals);
router.post('/:id/contribute', contributeToGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);

module.exports = router;