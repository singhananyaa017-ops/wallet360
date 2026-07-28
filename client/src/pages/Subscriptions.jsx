import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptions } from '../api/subscriptionApi';
import SubscriptionCard from '../components/SubscriptionCard';

function Subscriptions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await getSubscriptions();
        setData(res.data);
      } catch (error) {
        console.error('Failed to load subscriptions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-bold">Subscriptions</h1>
        <Link to="/dashboard" className="text-blue-400">← Back to Dashboard</Link>
      </div>

      {loading ? (
        <p className="text-slate-400">Scanning your expense history...</p>
      ) : data && data.subscriptions.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Total Monthly Cost</p>
              <p className="text-white text-xl font-bold">₹{data.totalMonthlyCost}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Total Annual Cost</p>
              <p className="text-white text-xl font-bold">₹{data.totalAnnualCost}</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.subscriptions.map((sub, index) => (
              <SubscriptionCard key={index} subscription={sub} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-slate-400">
          No subscriptions detected yet. We look for merchants charged 3+ times with a similar amount roughly every month.
        </p>
      )}
    </div>
  );
}

export default Subscriptions;