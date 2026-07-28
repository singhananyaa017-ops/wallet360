import { Pie } from 'react-chartjs-2';

const CATEGORY_COLORS = {
  Food: '#f87171',
  Shopping: '#fb923c',
  Bills: '#facc15',
  Healthcare: '#4ade80',
  Entertainment: '#60a5fa',
  Education: '#a78bfa',
  Travel: '#f472b6',
  Others: '#94a3b8',
};

function ExpensePieChart({ expenses }) {
  const totalsByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const labels = Object.keys(totalsByCategory);
  const values = Object.values(totalsByCategory);

  if (labels.length === 0) {
    return <p className="text-slate-400">No expense data yet.</p>;
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((cat) => CATEGORY_COLORS[cat] || '#94a3b8'),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#e2e8f0' },
      },
    },
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-3">Expense Distribution</h3>
      <Pie data={data} options={options} />
    </div>
  );
}

export default ExpensePieChart;