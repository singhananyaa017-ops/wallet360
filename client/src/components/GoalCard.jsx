import { useState } from 'react';
import toast from 'react-hot-toast';
import { contributeToGoal, deleteGoal } from '../api/savingsGoalApi';

function GoalCard({ goal, onChange }) {
  const [contributeAmount, setContributeAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const percent = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
  const isComplete = goal.savedAmount >= goal.targetAmount;

  const handleContribute = async (e) => {
    e.preventDefault();
    const amount = Number(contributeAmount);

    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      await contributeToGoal(goal._id, amount);
      toast.success('Contribution added!');
      setContributeAmount('');
      onChange();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(goal._id);
      toast.success('Goal removed');
      onChange();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-white font-medium">
          {goal.name} {isComplete && '🎉'}
        </h4>
        <button onClick={handleDelete} className="text-slate-400 hover:text-red-400 text-sm">
          Remove
        </button>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm mb-3">
        <span className="text-slate-400">
          ₹{goal.savedAmount} of ₹{goal.targetAmount}
        </span>
        <span className={isComplete ? 'text-green-400' : 'text-blue-400'}>
          {percent}%
        </span>
      </div>

      {!isComplete && (
        <form onSubmit={handleContribute} className="flex gap-2">
          <input
            type="number"
            step="0.01"
            value={contributeAmount}
            onChange={(e) => setContributeAmount(e.target.value)}
            placeholder="Add amount"
            className="flex-1 p-2 rounded bg-slate-700 text-white text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-50"
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
}

export default GoalCard;