/**
 * Navigation - Split nav with index rail
 */
import { useState } from 'react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: `1px solid var(--border)`,
      backgroundColor: 'var(--bg-1)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: `0 var(--space-6)`,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: Brand + Index */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
        }}>
          <a href="/" style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--fg-0)',
            textDecoration: 'none',
          }}>
            OpenGateway
          </a>
          <span style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-1)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>[SECURITY INFRASTRUCTURE]</span>
        </div>

        {/* Right: Nav Links (Desktop) + Mobile Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)',
        }} className="nav-links-desktop">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                position: 'relative',
                color: 'var(--fg-0)',
                fontSize: '13px',
                transition: 'all var(--dur-2) var(--ease-out)',
                textDecoration: 'none',
                paddingBottom: '4px',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--fg-0)';
              }}
            >
              {item.label}
            </a>
          ))}
          
          {/* Login Button */}
          <a
            href="/app/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-0)',
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-1)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all var(--dur-2) var(--ease-out)',
              border: 'none',
              cursor: 'pointer',
              marginLeft: 'var(--space-4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = 'var(--shadow-2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Login
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          style={{
            display: 'block',
            padding: 'var(--space-3)',
            color: 'var(--fg-0)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color var(--dur-2) var(--ease-out)',
          }}
          className="nav-toggle-mobile"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          display: 'block',
          backgroundColor: 'var(--bg-0)',
          borderTop: `1px solid var(--border)`,
          padding: 'var(--space-6)',
        }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: 'var(--space-3) 0',
                color: 'var(--fg-0)',
                textDecoration: 'none',
                transition: 'color var(--dur-2) var(--ease-out)',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--fg-0)';
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          
          {/* Mobile Login Link */}
          <a
            href="/app/login"
            style={{
              display: 'block',
              padding: 'var(--space-4) 0',
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border)',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color var(--dur-2) var(--ease-out)',
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
}
