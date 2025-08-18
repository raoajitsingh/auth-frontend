export default function Honeypot({ value, setValue }) {
  return (
    <div className="hidden" aria-hidden="true">
      <label>
        Do not fill this field
        <input
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
    </div>
  );
}
