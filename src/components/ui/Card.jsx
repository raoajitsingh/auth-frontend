export default function Card({ children }) {
  return (
    <div className="w-full max-w-md p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white animate-fade-in">
      {children}
    </div>
  );
}
