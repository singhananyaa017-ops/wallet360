import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createGoal } from '../api/savingsGoalApi';

function GoalForm({ onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await createGoal({
        name: data.name,
        targetAmount: Number(data.targetAmount),
        targetDate: data.targetDate || undefined,
      });
      toast.success('Goal created!');
      reset();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 p-4 rounded-lg flex gap-3 items-start mb-4 flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <input
          {...register('name', { required: 'Required' })}
          placeholder="Goal name (e.g. Laptop)"
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="flex-1 min-w-[120px]">
        <input
          type="number"
          step="0.01"
          {...register('targetAmount', { required: 'Required', min: { value: 1, message: 'Must be positive' } })}
          placeholder="Target amount"
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        {errors.targetAmount && <p className="text-red-400 text-sm mt-1">{errors.targetAmount.message}</p>}
      </div>

      <div className="flex-1 min-w-[150px]">
        <input
          type="date"
          {...register('targetDate')}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Goal
      </button>
    </form>
  );
}

export default GoalForm;