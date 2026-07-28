const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { detectSubscriptions } = require('../controllers/subscriptionController');

router.use(protect);
router.get('/', detectSubscriptions);

module.exports = router;