import { Line } from 'react-chartjs-2';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function YearlyTrendChart({ monthlyBreakdown }) {
  const totalsByMonth = Array(12).fill(0);

  monthlyBreakdown.forEach((entry) => {
    totalsByMonth[entry._id - 1] = entry.total;
  });

  const data = {
    labels: MONTH_SHORT,
    datasets: [
      {
        label: 'Monthly Spending',
        data: totalsByMonth,
        borderColor: '#f87171',
        backgroundColor: '#f8717133',
        tension: 0.3,
      },
    ],
  };

  const options = {
    plugins: { legend: { labels: { color: '#e2e8f0' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
    },
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-3">Yearly Spending Trend</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default YearlyTrendChart;