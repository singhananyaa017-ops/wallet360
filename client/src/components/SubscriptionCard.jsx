function SubscriptionCard({ subscription }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
      <div>
        <p className="text-white font-medium">{subscription.merchant}</p>
        <p className="text-slate-400 text-sm">
          {subscription.category} · Last charged {new Date(subscription.lastCharged).toLocaleDateString()}
        </p>
        <p className="text-slate-500 text-xs mt-1">
          Detected from {subscription.occurrences} charges
        </p>
      </div>
      <div className="text-right">
        <p className="text-white font-bold">₹{subscription.monthlyCost}/mo</p>
        <p className="text-slate-400 text-sm">₹{subscription.annualCost}/yr</p>
      </div>
    </div>
  );
}

export default SubscriptionCard;