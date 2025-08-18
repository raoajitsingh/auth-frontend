export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 text-white animate-scale-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
