import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createBudget } from '../api/budgetApi';

const CATEGORIES = ['Food', 'Shopping', 'Bills', 'Healthcare', 'Entertainment', 'Education', 'Travel', 'Others'];

function BudgetForm({ month, year, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await createBudget({
        category: data.category,
        amount: Number(data.amount),
        month,
        year,
      });
      toast.success('Budget set!');
      reset();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 p-4 rounded-lg flex gap-3 items-start mb-4">
      <div className="flex-1">
        <select
          {...register('category', { required: 'Required' })}
          className="w-full p-2 rounded bg-slate-700 text-white"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div className="flex-1">
        <input
          type="number"
          step="0.01"
          {...register('amount', { required: 'Required', min: { value: 1, message: 'Must be positive' } })}
          placeholder="Monthly limit"
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Set Budget
      </button>
    </form>
  );
}

export default BudgetForm;