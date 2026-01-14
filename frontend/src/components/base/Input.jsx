/**
 * Input - Text input with focus styling
 */

export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-small font-600 mb-space-3 text-[var(--fg-0)]">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-space-4 py-space-3 rounded-xs
          bg-[var(--bg-1)] border border-[var(--border)]
          text-[var(--fg-0)] placeholder-[var(--fg-1)] placeholder-opacity-60
          transition-all duration-140 ease-out
          focus:outline-none focus:border-[var(--accent2)] focus:shadow-focus
          ${error ? 'border-[#ff4d4d]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-mono text-[#ff4d4d] mt-space-2">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-small text-[var(--fg-1)] mt-space-2">{helperText}</p>
      )}
    </div>
  );
}
