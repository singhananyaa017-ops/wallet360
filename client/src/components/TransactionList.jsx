import toast from 'react-hot-toast';
import { deleteExpense } from '../api/expenseApi';
import { deleteIncome } from '../api/incomeApi';

function TransactionList({ transactions, onChange }) {
  const handleDelete = async (transaction) => {
    try {
      if (transaction.type === 'expense') {
        await deleteExpense(transaction._id);
      } else {
        await deleteIncome(transaction._id);
      }
      toast.success('Deleted');
      onChange();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (transactions.length === 0) {
    return <p className="text-slate-400">No transactions yet — add your first one above.</p>;
  }

  return (
    <div className="bg-slate-800 rounded-lg divide-y divide-slate-700">
      {transactions.map((t) => (
        <div key={t._id} className="flex justify-between items-center p-4">
          <div>
            <p className="text-white font-medium">
              {t.type === 'expense' ? t.merchant || t.category : t.source}
            </p>
            <p className="text-slate-400 text-sm">
              {t.category} · {new Date(t.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={t.type === 'expense' ? 'text-red-400' : 'text-green-400'}>
              {t.type === 'expense' ? '-' : '+'}₹{t.amount}
            </span>
            <button
              onClick={() => handleDelete(t)}
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

export default TransactionList;