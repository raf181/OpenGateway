/**
 * Button - Primary, Secondary, Ghost variants
 * Follows Index-Tab Editorial Futurism spec
 */

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all var(--dur-2) var(--ease-out)',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  const variants = {
    primary: {
      ...baseStyles,
      backgroundColor: 'var(--accent)',
      color: 'var(--bg-0)',
      padding: 'var(--space-3) var(--space-5)',
      borderRadius: 'var(--radius-1)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
    },
    secondary: {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: 'var(--fg-0)',
      padding: 'var(--space-3) var(--space-5)',
      borderRadius: 'var(--radius-1)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--border)',
    },
    ghost: {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      padding: 'var(--space-2) var(--space-3)',
    },
  };

  const handleMouseEnter = (e) => {
    if (variant === 'primary') {
      e.target.style.borderColor = 'var(--bg-0)';
      e.target.style.borderOpacity = '0.3';
      e.target.style.transform = 'translateY(-1px)';
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = 'var(--bg-1)';
      e.target.style.borderColor = 'var(--fg-0)';
    }
  };

  const handleMouseLeave = (e) => {
    if (variant === 'primary') {
      e.target.style.borderColor = 'transparent';
      e.target.style.transform = 'translateY(0)';
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.borderColor = 'var(--border)';
    }
  };

  const handleMouseDown = (e) => {
    if (variant === 'primary') {
      e.target.style.transform = 'translateY(0)';
    }
  };

  return (
    <button
      style={variants[variant]}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {children}
    </button>
  );
}
