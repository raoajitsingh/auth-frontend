export default function Tabs({ value, onChange, items }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-3 py-2 rounded-xl border border-white/20 text-sm capitalize transition
            ${
              value === t
                ? "bg-white/15 text-white shadow-inner"
                : "bg-white/5 text-white/80 hover:bg-white/10"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
