/**
 * CropMarks - Signature motif component
 * Draws subtle crop-mark corners on featured cards/blocks
 * Reinforces the "designed artifact" aesthetic
 */

export function CropMarks({ size = 16, color = 'var(--accent)' }) {
  const strokeWidth = 1.5;
  const offset = 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: 'absolute',
        stroke: color,
        strokeWidth,
        fill: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Top-left corner */}
      <path d={`M ${offset} 0 L 0 0 L 0 ${offset}`} />
      {/* Top-right corner */}
      <path d={`M ${size - offset} 0 L ${size} 0 L ${size} ${offset}`} />
      {/* Bottom-left corner */}
      <path d={`M 0 ${size - offset} L 0 ${size} L ${offset} ${size}`} />
      {/* Bottom-right corner */}
      <path d={`M ${size - offset} ${size} L ${size} ${size} L ${size} ${size - offset}`} />
    </svg>
  );
}

/**
 * CropMarksContainer - Wrapper that applies crop marks to all four corners
 */
export function CropMarksContainer({ children, size = 16 }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Top-left */}
      <div style={{ position: 'absolute', top: -2, left: -2 }}>
        <CropMarks size={size} />
      </div>
      {/* Top-right */}
      <div style={{ position: 'absolute', top: -2, right: -2 }}>
        <CropMarks size={size} style={{ transform: 'scaleX(-1)' }} />
      </div>
      {/* Bottom-left */}
      <div style={{ position: 'absolute', bottom: -2, left: -2 }}>
        <CropMarks size={size} style={{ transform: 'scaleY(-1)' }} />
      </div>
      {/* Bottom-right */}
      <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
        <CropMarks size={size} style={{ transform: 'scale(-1)' }} />
      </div>
      {children}
    </div>
  );
}
