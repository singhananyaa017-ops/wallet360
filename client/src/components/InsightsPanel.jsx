const TYPE_STYLES = {
  danger: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  positive: 'bg-green-500/10 border-green-500/30 text-green-400',
  neutral: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
};

const TYPE_ICONS = {
  danger: '🔴',
  warning: '🟠',
  positive: '🟢',
  neutral: '💡',
};

function InsightsPanel({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-6">
      <h3 className="text-white font-semibold mb-3">Smart Insights</h3>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 text-sm flex gap-2 items-start ${TYPE_STYLES[insight.type] || TYPE_STYLES.neutral}`}
          >
            <span>{TYPE_ICONS[insight.type] || TYPE_ICONS.neutral}</span>
            <span>{insight.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsightsPanel;