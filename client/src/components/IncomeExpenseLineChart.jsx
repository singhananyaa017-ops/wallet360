import { Line } from 'react-chartjs-2';

function getLastSixMonths() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return months;
}

function IncomeExpenseLineChart({ expenses, incomes }) {
  const months = getLastSixMonths();

  const expenseTotals = months.map(({ year, month }) =>
    expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, e) => sum + e.amount, 0)
  );

  const incomeTotals = months.map(({ year, month }) =>
    incomes
      .filter((i) => {
        const d = new Date(i.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, i) => sum + i.amount, 0)
  );

  const data = {
    labels: months.map((m) => m.label),
    datasets: [
      {
        label: 'Income',
        data: incomeTotals,
        borderColor: '#4ade80',
        backgroundColor: '#4ade8033',
        tension: 0.3,
      },
      {
        label: 'Expense',
        data: expenseTotals,
        borderColor: '#f87171',
        backgroundColor: '#f8717133',
        tension: 0.3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
    },
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-3">Income vs Expense (6 months)</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default IncomeExpenseLineChart;