import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import RecurringForm from '../components/RecurringForm';
import RecurringList from '../components/RecurringList';
import { getRecurring } from '../api/recurringApi';

function Recurring() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await getRecurring();
      setItems(res.data);
    } catch (error) {
      console.error('Failed to load recurring transactions', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-bold">Recurring Transactions</h1>
        <Link to="/dashboard" className="text-blue-400">← Back to Dashboard</Link>
      </div>

      <RecurringForm onSuccess={fetchItems} />

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <RecurringList items={items} onChange={fetchItems} />
      )}
    </div>
  );
}

export default Recurring;