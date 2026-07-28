import toast from 'react-hot-toast';
import { updateRecurring, deleteRecurring } from '../api/recurringApi';

const FREQUENCY_LABEL = { weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };

function RecurringList({ items, onChange }) {
  const handleToggleActive = async (item) => {
    try {
      await updateRecurring(item._id, { active: !item.active });
      toast.success(item.active ? 'Paused' : 'Resumed');
      onChange();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteRecurring(item._id);
      toast.success('Deleted');
      onChange();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (items.length === 0) {
    return <p className="text-slate-400">No recurring transactions yet.</p>;
  }

  return (
    <div className="bg-slate-800 rounded-lg divide-y divide-slate-700">
      {items.map((item) => (
        <div key={item._id} className="flex justify-between items-center p-4">
          <div>
            <p className="text-white font-medium">
              {item.label} {!item.active && <span className="text-slate-500 text-xs">(paused)</span>}
            </p>
            <p className="text-slate-400 text-sm">
              {item.category} · {FREQUENCY_LABEL[item.frequency]} · Next: {new Date(item.nextDueDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={item.transactionType === 'expense' ? 'text-red-400' : 'text-green-400'}>
              {item.transactionType === 'expense' ? '-' : '+'}₹{item.amount}
            </span>
            <button
              onClick={() => handleToggleActive(item)}
              className="text-slate-400 hover:text-blue-400 text-sm"
            >
              {item.active ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="text-slate-400 hover:text-red-400 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecurringList;