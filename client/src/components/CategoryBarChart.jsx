import { Bar } from 'react-chartjs-2';
import { BarElement } from 'chart.js';
import { Chart as ChartJS } from 'chart.js';

ChartJS.register(BarElement);

function CategoryBarChart({ categoryBreakdown }) {
  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return <p className="text-slate-400">No expense data for this month.</p>;
  }

  const data = {
    labels: categoryBreakdown.map((c) => c._id),
    datasets: [
      {
        label: 'Spent',
        data: categoryBreakdown.map((c) => c.total),
        backgroundColor: '#60a5fa',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
    },
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-3">Spending by Category</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

export default CategoryBarChart;