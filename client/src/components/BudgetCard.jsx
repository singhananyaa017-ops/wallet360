import toast from 'react-hot-toast';
import { deleteBudget } from '../api/budgetApi';

function getStatusColor(percentUsed) {
  if (percentUsed >= 100) return { bar: 'bg-red-500', text: 'text-red-400' };
  if (percentUsed >= 80) return { bar: 'bg-orange-500', text: 'text-orange-400' };
  if (percentUsed >= 50) return { bar: 'bg-yellow-500', text: 'text-yellow-400' };
  return { bar: 'bg-green-500', text: 'text-green-400' };
}

function getStatusMessage(percentUsed) {
  if (percentUsed >= 100) return 'Budget exceeded!';
  if (percentUsed >= 80) return 'Approaching limit';
  if (percentUsed >= 50) return 'On track';
  return 'Well within budget';
}

function BudgetCard({ budget, onChange }) {
  const { bar, text } = getStatusColor(budget.percentUsed);
  const cappedPercent = Math.min(budget.percentUsed, 100);

  const handleDelete = async () => {
    try {
      await deleteBudget(budget._id);
      toast.success('Budget removed');
      onChange();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-white font-medium">{budget.category}</h4>
        <button onClick={handleDelete} className="text-slate-400 hover:text-red-400 text-sm">
          Remove
        </button>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full ${bar} transition-all`}
          style={{ width: `${cappedPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-slate-400">
          ₹{budget.spent} of ₹{budget.amount}
        </span>
        <span className={text}>{budget.percentUsed}% · {getStatusMessage(budget.percentUsed)}</span>
      </div>

      {budget.remaining < 0 && (
        <p className="text-red-400 text-sm mt-1">
          ₹{Math.abs(budget.remaining)} over budget
        </p>
      )}
    </div>
  );
}

export default BudgetCard;