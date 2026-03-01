export default function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="input"
      />
    </div>
  )
}

export function FormSelect({ label, value, onChange, options, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <select value={value} onChange={onChange} className="input">
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface2">
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
