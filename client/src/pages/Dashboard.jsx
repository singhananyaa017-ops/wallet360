import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExpenses } from '../api/expenseApi';
import { getIncomes } from '../api/incomeApi';
import { getBudgets } from '../api/budgetApi';
import { getGoals } from '../api/savingsGoalApi';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpensePieChart from '../components/ExpensePieChart';
import IncomeExpenseLineChart from '../components/IncomeExpenseLineChart';
import BudgetForm from '../components/BudgetForm';
import BudgetCard from '../components/BudgetCard';
import GoalForm from '../components/GoalForm';
import GoalCard from '../components/GoalCard';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const fetchData = useCallback(async () => {
    try {
      const [expensesRes, incomesRes] = await Promise.all([getExpenses(), getIncomes()]);

      const expenses = expensesRes.data.map((e) => ({ ...e, type: 'expense' }));
      const incomes = incomesRes.data.map((i) => ({ ...i, type: 'income' }));

      const combined = [...expenses, ...incomes].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(combined);
    } catch (error) {
      console.error('Failed to load transactions', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    try {
      const res = await getBudgets(currentMonth, currentYear);
      setBudgets(res.data);
    } catch (error) {
      console.error('Failed to load budgets', error);
    }
  }, [currentMonth, currentYear]);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await getGoals();
      setGoals(res.data);
    } catch (error) {
      console.error('Failed to load goals', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchBudgets();
    fetchGoals();
  }, [fetchData, fetchBudgets, fetchGoals]);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div>
  <h1 className="text-2xl text-white font-bold">Welcome, {user?.name} 👋</h1>
  <div className="flex gap-3">
  <Link to="/analytics" className="text-blue-400 text-sm">View Analytics →</Link>
  <Link to="/recurring" className="text-blue-400 text-sm">Manage Recurring →</Link>
  <Link to="/subscriptions" className="text-blue-400 text-sm">Subscriptions →</Link>
</div>
</div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm">Balance</p>
          <p className="text-white text-xl font-bold">₹{balance}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm">Income</p>
          <p className="text-green-400 text-xl font-bold">₹{totalIncome}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm">Expenses</p>
          <p className="text-red-400 text-xl font-bold">₹{totalExpense}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ExpensePieChart expenses={transactions.filter((t) => t.type === 'expense')} />
        <IncomeExpenseLineChart
          expenses={transactions.filter((t) => t.type === 'expense')}
          incomes={transactions.filter((t) => t.type === 'income')}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Monthly Budgets</h3>
        <BudgetForm month={currentMonth} year={currentYear} onSuccess={fetchBudgets} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => (
            <BudgetCard key={budget._id} budget={budget} onChange={fetchBudgets} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Savings Goals</h3>
        <GoalForm onSuccess={fetchGoals} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} onChange={fetchGoals} />
          ))}
        </div>
      </div>

      <TransactionForm onSuccess={() => { fetchData(); fetchBudgets(); }} />

      {loading ? (
        <p className="text-slate-400">Loading transactions...</p>
      ) : (
        <TransactionList transactions={transactions} onChange={fetchData} />
      )}
    </div>
  );
}

export default Dashboard;