/**
 * Badge - Inline label component
 */

export function Badge({
  variant = 'neutral',
  children,
  className = '',
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--space-1) var(--space-3)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-1)',
  };

  const variants = {
    neutral: {
      ...baseStyles,
      border: '1px solid var(--border)',
      color: 'var(--fg-0)',
      backgroundColor: 'transparent',
    },
    accent: {
      ...baseStyles,
      border: '1px solid var(--accent)',
      backgroundColor: 'var(--accent)',
      opacity: 0.1,
      color: 'var(--accent)',
    },
  };

  return (
    <span style={variants[variant]} className={className}>
      {children}
    </span>
  );
}
