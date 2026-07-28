const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRecurring,
  getRecurring,
  updateRecurring,
  deleteRecurring,
} = require('../controllers/recurringController');

router.use(protect);

router.route('/').post(createRecurring).get(getRecurring);
router.route('/:id').put(updateRecurring).delete(deleteRecurring);

module.exports = router;