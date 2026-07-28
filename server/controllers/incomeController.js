const Income = require('../models/Income');

// @desc   Create new income
// @route  POST /api/income
exports.createIncome = async (req, res) => {
  try {
    const { amount, source, category, date, notes } = req.body;

    const income = await Income.create({
      user: req.user._id,
      amount,
      source,
      category,
      date,
      notes,
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get all income entries for logged-in user
// @route  GET /api/income
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single income by ID
// @route  GET /api/income/:id
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this income' });
    }

    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update income
// @route  PUT /api/income/:id
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this income' });
    }

    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete income
// @route  DELETE /api/income/:id
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this income' });
    }

    await income.deleteOne();

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};