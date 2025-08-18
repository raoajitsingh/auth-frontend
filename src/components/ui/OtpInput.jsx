import Input from "./Input";

export default function OtpInput({ value, onChange, status }) {
  // status: "ok" | "bad" | null
  const ring =
    status === "ok"
      ? "ring-2 ring-emerald-400/50"
      : status === "bad"
      ? "ring-2 ring-rose-400/50"
      : "";
  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="6-digit code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pr-8 ${ring}`}
      />
      <div className="absolute inset-y-0 right-2 flex items-center text-lg">
        {status === "ok" && <span className="text-emerald-400">✔</span>}
        {status === "bad" && <span className="text-rose-400">✕</span>}
      </div>
    </div>
  );
}
