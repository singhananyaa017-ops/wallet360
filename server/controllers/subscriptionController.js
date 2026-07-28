const Expense = require('../models/Expense');

function isWithinTolerance(a, b, tolerancePercent = 5) {
  const diff = Math.abs(a - b);
  const avg = (a + b) / 2;
  return (diff / avg) * 100 <= tolerancePercent;
}

function daysBetween(date1, date2) {
  const diffMs = Math.abs(new Date(date1) - new Date(date2));
  return diffMs / (1000 * 60 * 60 * 24);
}

// @desc   Detect likely subscriptions from expense history
// @route  GET /api/subscriptions
exports.detectSubscriptions = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
      merchant: { $ne: '', $exists: true },
    }).sort({ date: 1 });

    // Group by merchant name (case-insensitive)
    const groupedByMerchant = {};
    expenses.forEach((e) => {
      const key = e.merchant.trim().toLowerCase();
      if (!groupedByMerchant[key]) groupedByMerchant[key] = [];
      groupedByMerchant[key].push(e);
    });

    const subscriptions = [];

    Object.entries(groupedByMerchant).forEach(([merchantKey, txns]) => {
      if (txns.length < 3) return; // not enough data points

      // Check consecutive pairs for consistent amount + ~monthly spacing
      let consistentPairs = 0;
      for (let i = 1; i < txns.length; i++) {
        const sameAmount = isWithinTolerance(txns[i].amount, txns[i - 1].amount);
        const gapDays = daysBetween(txns[i].date, txns[i - 1].date);
        const monthlyGap = gapDays >= 25 && gapDays <= 35;

        if (sameAmount && monthlyGap) consistentPairs++;
      }

      // If most consecutive pairs look consistent, call it a subscription
      if (consistentPairs >= txns.length - 2) {
        const latest = txns[txns.length - 1];
        const avgAmount =
          txns.reduce((sum, t) => sum + t.amount, 0) / txns.length;

        subscriptions.push({
          merchant: latest.merchant,
          category: latest.category,
          monthlyCost: Math.round(avgAmount * 100) / 100,
          annualCost: Math.round(avgAmount * 12 * 100) / 100,
          occurrences: txns.length,
          lastCharged: latest.date,
        });
      }
    });

    subscriptions.sort((a, b) => b.monthlyCost - a.monthlyCost);

    const totalMonthlyCost = subscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);
    const totalAnnualCost = subscriptions.reduce((sum, s) => sum + s.annualCost, 0);

    res.status(200).json({
      subscriptions,
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      totalAnnualCost: Math.round(totalAnnualCost * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};