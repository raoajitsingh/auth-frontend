export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base = "w-full py-2 rounded-xl transition disabled:opacity-50";
  const styles = {
    primary: "bg-indigo-500 hover:bg-indigo-600",
    success: "bg-emerald-500 hover:bg-emerald-600",
    ghost: "border border-white/20 bg-white/5 hover:bg-white/10",
  }[variant];
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
