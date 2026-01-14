/**
 * TabLabel - Signature motif component
 * Renders a protruding index tab label on major blocks
 * Used with index notation like [01], [02], etc.
 */

export function TabLabel({ index, label = '', className = '' }) {
  return (
    <div
      className={`absolute -top-0 left-space-6 flex items-center gap-space-2 ${className}`}
      style={{
        transform: 'translateY(-50%)',
      }}
    >
      {/* Notched tab background */}
      <div
        className="flex items-center justify-center px-space-4 py-space-2"
        style={{
          backgroundColor: 'var(--accent)',
          color: 'var(--bg-0)',
          height: 'var(--tab-height)',
          borderRadius: 'var(--radius-1)',
          clipPath: 'polygon(0 0, calc(100% - var(--tab-notch)) 0, 100% 50%, calc(100% - var(--tab-notch)) 100%, 0 100%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label || `[${String(index).padStart(2, '0')}]`}
      </div>
    </div>
  );
}
