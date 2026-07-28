import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MonthYearSelector from '../components/MonthYearSelector';
import CategoryBarChart from '../components/CategoryBarChart';
import YearlyTrendChart from '../components/YearlyTrendChart';
import InsightsPanel from '../components/InsightsPanel';
import {
  getMonthlyAnalytics,
  getIncomeVsExpense,
  getMonthlyComparison,
  getYearlyAnalytics,
} from '../api/analyticsApi';
import { getInsights } from '../api/insightsApi';

function Analytics() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const [monthly, setMonthly] = useState(null);
  const [incomeVsExpense, setIncomeVsExpense] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [yearly, setYearly] = useState(null);
  const [insights, setInsights] = useState([]);

  const fetchAll = useCallback(async () => {
    try {
      const [monthlyRes, ivERes, compRes, yearlyRes, insightsRes] = await Promise.all([
        getMonthlyAnalytics(month, year),
        getIncomeVsExpense(month, year),
        getMonthlyComparison(month, year),
        getYearlyAnalytics(year),
        getInsights(month, year),
      ]);
      setMonthly(monthlyRes.data);
      setIncomeVsExpense(ivERes.data);
      setComparison(compRes.data);
      setYearly(yearlyRes.data);
      setInsights(insightsRes.data.insights);
    } catch (error) {
      console.error('Failed to load analytics', error);
    }
  }, [month, year]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleMonthYearChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-bold">Analytics</h1>
        <Link to="/dashboard" className="text-blue-400">← Back to Dashboard</Link>
      </div>

      <MonthYearSelector month={month} year={year} onChange={handleMonthYearChange} />

      <InsightsPanel insights={insights} />

      {incomeVsExpense && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Income</p>
            <p className="text-green-400 text-xl font-bold">₹{incomeVsExpense.totalIncome}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Expenses</p>
            <p className="text-red-400 text-xl font-bold">₹{incomeVsExpense.totalExpense}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Savings Rate</p>
            <p className="text-blue-400 text-xl font-bold">{incomeVsExpense.savingsRate}%</p>
          </div>
        </div>
      )}

      {comparison && (
        <div className="bg-slate-800 p-4 rounded-lg mb-6">
          <p className="text-slate-400 text-sm mb-1">vs. Previous Month</p>
          {comparison.trend === 'no-data' ? (
            <p className="text-slate-400">No data for previous month to compare.</p>
          ) : (
            <p className={comparison.trend === 'increase' ? 'text-red-400' : 'text-green-400'}>
              {comparison.trend === 'increase' ? '▲' : '▼'} {Math.abs(comparison.percentChange)}%
              {comparison.trend === 'increase' ? ' more' : ' less'} spending than last month
            </p>
          )}
        </div>
      )}

      {monthly && (
        <>
          <div className="mb-6">
            <CategoryBarChart categoryBreakdown={monthly.categoryBreakdown} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Avg Daily Spending</p>
              <p className="text-white text-lg font-bold">₹{monthly.avgDailySpending}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Highest Category</p>
              <p className="text-white text-lg font-bold">
                {monthly.highestSpendingCategory?._id || 'N/A'}
              </p>
            </div>
          </div>
        </>
      )}

      {yearly && (
        <div className="mb-6">
          <YearlyTrendChart monthlyBreakdown={yearly.monthlyBreakdown} />
        </div>
      )}
    </div>
  );
}

export default Analytics;