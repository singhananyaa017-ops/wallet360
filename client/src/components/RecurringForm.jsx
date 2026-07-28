import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createRecurring } from '../api/recurringApi';

const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Education', 'Travel', 'Others'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

function RecurringForm({ onSuccess }) {
  const [transactionType, setTransactionType] = useState('expense');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await createRecurring({
        transactionType,
        amount: Number(data.amount),
        category: data.category,
        label: data.label,
        frequency: data.frequency,
        startDate: data.startDate,
      });
      toast.success('Recurring transaction created!');
      reset();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-6">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTransactionType('expense')}
          className={`px-4 py-2 rounded ${transactionType === 'expense' ? 'bg-red-600' : 'bg-slate-700'} text-white`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setTransactionType('income')}
          className={`px-4 py-2 rounded ${transactionType === 'income' ? 'bg-green-600' : 'bg-slate-700'} text-white`}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register('label', { required: 'Label is required' })}
              placeholder="Label (e.g. Netflix, Rent, Salary)"
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
            {errors.label && <p className="text-red-400 text-sm mt-1">{errors.label.message}</p>}
          </div>

          <div>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: 'Required', min: { value: 0.01, message: 'Must be positive' } })}
              placeholder="Amount"
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <select
              {...register('category', { required: 'Required' })}
              className="w-full p-2 rounded bg-slate-700 text-white"
            >
              <option value="">Category</option>
              {(transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
          </div>

          <select
            {...register('frequency', { required: true })}
            className="w-full p-2 rounded bg-slate-700 text-white"
            defaultValue="monthly"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <div>
            <input
              type="date"
              {...register('startDate', { required: 'Required' })}
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
            {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Recurring {transactionType === 'expense' ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  );
}

export default RecurringForm;