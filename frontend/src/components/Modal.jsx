import { useState } from 'react';

export default function Modal({ open, onClose, title, children }) {
  const [closeHovered, setCloseHovered] = useState(false);
  
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '16px',
      }}>
        {/* Backdrop */}
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <div style={{
          position: 'relative',
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border)',
          maxWidth: '448px',
          width: '100%',
          padding: '24px',
          zIndex: 10,
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--fg-0)',
              fontFamily: 'var(--font-display)',
              margin: 0,
            }}>{title}</h3>
            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                padding: '4px',
                background: 'none',
                border: 'none',
                color: closeHovered ? 'var(--fg-0)' : 'var(--fg-1)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-1)',
                transition: 'color 0.2s',
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
