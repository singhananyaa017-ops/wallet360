const RecurringTransaction = require('../models/RecurringTransaction');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const advanceDate = (date, frequency) => {
  const newDate = new Date(date);
  if (frequency === 'weekly') newDate.setDate(newDate.getDate() + 7);
  if (frequency === 'monthly') newDate.setMonth(newDate.getMonth() + 1);
  if (frequency === 'yearly') newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
};

// Called internally (not a route) to generate any due transactions for a user
const generateDueTransactions = async (userId) => {
  const now = new Date();

  const dueItems = await RecurringTransaction.find({
    user: userId,
    active: true,
    nextDueDate: { $lte: now },
  });

  for (const item of dueItems) {
    // Keep generating until nextDueDate is in the future
    // (handles cases where the user hasn't opened the app in a while)
    while (item.nextDueDate <= now) {
      if (item.transactionType === 'expense') {
        await Expense.create({
          user: item.user,
          amount: item.amount,
          category: item.category,
          merchant: item.label,
          date: item.nextDueDate,
          notes: 'Auto-generated from recurring transaction',
        });
      } else {
        await Income.create({
          user: item.user,
          amount: item.amount,
          source: item.label,
          category: item.category,
          date: item.nextDueDate,
          notes: 'Auto-generated from recurring transaction',
        });
      }

      item.nextDueDate = advanceDate(item.nextDueDate, item.frequency);
    }

    await item.save();
  }
};

// @desc   Create new recurring transaction
// @route  POST /api/recurring
exports.createRecurring = async (req, res) => {
  try {
    const { transactionType, amount, category, label, frequency, startDate } = req.body;

    const recurring = await RecurringTransaction.create({
      user: req.user._id,
      transactionType,
      amount,
      category,
      label,
      frequency,
      nextDueDate: startDate || new Date(),
    });

    res.status(201).json(recurring);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get all recurring transactions (and trigger generation of due ones first)
// @route  GET /api/recurring
exports.getRecurring = async (req, res) => {
  try {
    await generateDueTransactions(req.user._id);

    const items = await RecurringTransaction.find({ user: req.user._id }).sort({ nextDueDate: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Toggle active/paused
// @route  PUT /api/recurring/:id
exports.updateRecurring = async (req, res) => {
  try {
    const item = await RecurringTransaction.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Recurring transaction not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await RecurringTransaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete recurring transaction
// @route  DELETE /api/recurring/:id
exports.deleteRecurring = async (req, res) => {
  try {
    const item = await RecurringTransaction.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Recurring transaction not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.deleteOne();

    res.status(200).json({ message: 'Recurring transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateDueTransactions = generateDueTransactions;