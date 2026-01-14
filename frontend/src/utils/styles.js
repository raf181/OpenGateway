/**
 * Utility functions for inline styles
 * Replaces Tailwind classes with CSS-in-JS
 */

export const flex = (direction = 'row', gap = 'var(--space-4)', items = 'center', justify = 'flex-start') => ({
  display: 'flex',
  flexDirection: direction,
  gap,
  alignItems: items,
  justifyContent: justify,
});

export const grid = (cols = 1, gap = 'var(--space-6)') => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
  gap,
});

export const container = (maxWidth = '1240px', px = 'var(--space-6)') => ({
  maxWidth,
  margin: '0 auto',
  padding: `0 ${px}`,
});

export const section = (py = 'var(--space-8)', borderBottom = true) => ({
  paddingTop: py,
  paddingBottom: py,
  ...(borderBottom && { borderBottom: '1px solid var(--border)' }),
});

export const transition = (property = 'all', duration = 'var(--dur-2)', easing = 'var(--ease-out)') => ({
  transition: `${property} ${duration} ${easing}`,
});

export const heading = (level = 1) => {
  const sizes = {
    1: 'clamp(44px, 6vw, 84px)',
    2: 'clamp(28px, 3.2vw, 44px)',
    3: '22px',
    4: '18px',
  };
  return {
    fontFamily: 'var(--font-display)',
    fontSize: sizes[level],
    fontWeight: 700,
    lineHeight: 1.1,
    margin: 0,
  };
};

export const text = (size = 'base', weight = 400) => {
  const sizes = {
    xs: '11px',
    sm: '13px',
    base: '16px',
    lg: '18px',
  };
  return {
    fontFamily: 'var(--font-ui)',
    fontSize: sizes[size],
    fontWeight: weight,
    margin: 0,
  };
};
