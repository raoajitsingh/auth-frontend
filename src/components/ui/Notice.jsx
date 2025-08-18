export default function Notice({ kind = "info", children, onClose }) {
  const color =
    kind === "error"
      ? "bg-rose-500/15 border-rose-400/30 text-rose-200"
      : kind === "success"
      ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
      : "bg-white/10 border-white/20 text-white/80";
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-3 py-2 ${color}`}
    >
      <div className="text-sm leading-5">{children}</div>
      {onClose && (
        <button
          className="ml-auto text-white/70 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  );
}
