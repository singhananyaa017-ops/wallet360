import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createExpense } from '../api/expenseApi';
import { createIncome } from '../api/incomeApi';

const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Education', 'Travel', 'Others'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'];

function TransactionForm({ onSuccess }) {
  const [type, setType] = useState('expense');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      if (type === 'expense') {
        await createExpense(data);
      } else {
        await createIncome(data);
      }
      toast.success(`${type === 'expense' ? 'Expense' : 'Income'} added!`);
      reset();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setType('expense')}
          className={`px-4 py-2 rounded ${type === 'expense' ? 'bg-red-600' : 'bg-slate-700'} text-white`}
        >
          Expense
        </button>
        <button
          onClick={() => setType('income')}
          className={`px-4 py-2 rounded ${type === 'income' ? 'bg-green-600' : 'bg-slate-700'} text-white`}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Must be positive' } })}
              placeholder="Amount"
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full p-2 rounded bg-slate-700 text-white"
            >
              <option value="">Select category</option>
              {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
          </div>
        </div>

        {type === 'expense' ? (
          <div className="grid grid-cols-2 gap-3">
            <input
              {...register('merchant')}
              placeholder="Merchant (optional)"
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
            <select
              {...register('paymentMethod')}
              className="w-full p-2 rounded bg-slate-700 text-white"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>
        ) : (
          <input
            {...register('source', { required: 'Source is required' })}
            placeholder="Source (e.g. Acme Corp)"
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
        )}

        <input
          type="date"
          {...register('date', { required: 'Date is required' })}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />

        <input
          {...register('notes')}
          placeholder="Notes (optional)"
          className="w-full p-2 rounded bg-slate-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;