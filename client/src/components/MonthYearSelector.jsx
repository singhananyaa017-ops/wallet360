const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function MonthYearSelector({ month, year, onChange }) {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 3; y <= currentYear; y++) {
    years.push(y);
  }

  return (
    <div className="flex gap-3 mb-6">
      <select
        value={month}
        onChange={(e) => onChange(Number(e.target.value), year)}
        className="p-2 rounded bg-slate-700 text-white"
      >
        {MONTH_NAMES.map((name, index) => (
          <option key={name} value={index}>{name}</option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => onChange(month, Number(e.target.value))}
        className="p-2 rounded bg-slate-700 text-white"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

export default MonthYearSelector;