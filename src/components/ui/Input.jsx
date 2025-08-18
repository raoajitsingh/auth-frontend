import { forwardRef } from "react";
export const Label = ({ children }) => (
  <label className="block text-sm text-white/80 mb-1">{children}</label>
);

const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-white
        placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition ${className}`}
      {...props}
    />
  );
});

export default Input;
