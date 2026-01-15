import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Modal from '../Modal';

export default function MarketingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/product', label: 'Product' },
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/#use-cases', label: 'Use cases' },
    { href: '/#security', label: 'Security' },
    { href: '/#integrations', label: 'Integrations' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#faq', label: 'FAQ' },
  ];

  const linkStyle = {
    fontSize: '14px',
    color: 'var(--fg-1)',
    textDecoration: 'none',
    transition: 'color var(--dur-2) var(--ease-out)',
    fontFamily: 'var(--font-ui)',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-0)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(11, 13, 16, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <nav style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 var(--space-4)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}>
            {/* Logo */}
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              textDecoration: 'none',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--accent)',
                borderRadius: 'var(--radius-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', color: 'var(--bg-0)' }} fill="currentColor">
                  <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
                </svg>
              </div>
              <span style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--fg-0)',
                fontFamily: 'var(--font-display)',
              }}>GeoCustody</span>
            </Link>

            {/* Desktop nav */}
            <div className="desktop-nav" style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-6)',
            }}>
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-1)'}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="desktop-nav" style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}>
              <Link 
                to="/app/login" 
                style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-1)'}
              >
                Sign in
              </Link>
              <button
                onClick={() => setDemoModalOpen(true)}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-0)',
                  border: 'none',
                  borderRadius: 'var(--radius-1)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  transition: 'all var(--dur-2) var(--ease-out)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Book a demo
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="mobile-menu-btn"
              style={{
                padding: 'var(--space-2)',
                background: 'none',
                border: 'none',
                color: 'var(--fg-0)',
                cursor: 'pointer',
                display: 'block',
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div style={{
              padding: 'var(--space-4) 0',
              borderTop: '1px solid var(--border)',
            }}>
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: 'var(--space-2) 0',
                    color: 'var(--fg-1)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-ui)',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div style={{
                marginTop: 'var(--space-4)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                <Link 
                  to="/app/login" 
                  style={{
                    padding: 'var(--space-2) 0',
                    color: 'var(--fg-1)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Sign in
                </Link>
                <button
                  onClick={() => {
                    setDemoModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-0)',
                    border: 'none',
                    borderRadius: 'var(--radius-1)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    width: '100%',
                  }}
                >
                  Book a demo
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main>
        <Outlet context={{ setDemoModalOpen, setPricingModalOpen }} />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-1)',
        color: 'var(--fg-0)',
        padding: 'var(--space-8) 0',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 var(--space-4)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: 'var(--radius-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', color: 'var(--bg-0)' }} fill="currentColor">
                    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
                  </svg>
                </div>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                }}>GeoCustody</span>
              </div>
              <p style={{
                color: 'var(--fg-1)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
              }}>
                Chain-of-custody verification powered by Telefónica Open Gateway.
              </p>
            </div>
            <div>
              <h4 style={{
                fontWeight: 600,
                marginBottom: 'var(--space-4)',
                fontFamily: 'var(--font-ui)',
              }}>Product</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                {[
                  { href: '/product', label: 'Overview' },
                  { href: '/#how-it-works', label: 'How it works' },
                  { href: '/#use-cases', label: 'Use cases' },
                  { href: '/#pricing', label: 'Pricing' },
                ].map(item => (
                  <li key={item.href}>
                    <a 
                      href={item.href}
                      style={{
                        color: 'var(--fg-1)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontFamily: 'var(--font-ui)',
                        transition: 'color var(--dur-2) var(--ease-out)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--fg-0)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-1)'}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{
                fontWeight: 600,
                marginBottom: 'var(--space-4)',
                fontFamily: 'var(--font-ui)',
              }}>Company</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                {['Privacy', 'Security', 'Compliance', 'Status'].map(label => (
                  <li key={label}>
                    <a 
                      href="#"
                      style={{
                        color: 'var(--fg-1)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontFamily: 'var(--font-ui)',
                        transition: 'color var(--dur-2) var(--ease-out)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--fg-0)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-1)'}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{
                fontWeight: 600,
                marginBottom: 'var(--space-4)',
                fontFamily: 'var(--font-ui)',
              }}>Contact</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                <li>
                  <a 
                    href="mailto:sales@placeholder"
                    style={{
                      color: 'var(--fg-1)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: 'var(--font-ui)',
                      transition: 'color var(--dur-2) var(--ease-out)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--fg-0)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-1)'}
                  >
                    sales@placeholder
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:support@placeholder"
                    style={{
                      color: 'var(--fg-1)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: 'var(--font-ui)',
                      transition: 'color var(--dur-2) var(--ease-out)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--fg-0)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-1)'}
                  >
                    support@placeholder
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div style={{
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            color: 'var(--fg-1)',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
          }}>
            © {new Date().getFullYear()} GeoCustody. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <Modal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} title="Book a Demo">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Email</label>
            <input 
              type="email" 
              className="input" 
              placeholder="work@company.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Company</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Company name"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Message</label>
            <textarea 
              className="input" 
              rows="3" 
              placeholder="Tell us about your use case"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button 
            type="button" 
            onClick={() => setDemoModalOpen(false)}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-0)',
              border: 'none',
              borderRadius: 'var(--radius-1)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Request Demo
          </button>
          <p style={{
            fontSize: '12px',
            color: 'var(--fg-1)',
            textAlign: 'center',
            margin: 0,
            fontFamily: 'var(--font-ui)',
          }}>
            This is a demo form. No data is submitted.
          </p>
        </form>
      </Modal>

      {/* Pricing Modal */}
      <Modal open={pricingModalOpen} onClose={() => setPricingModalOpen(false)} title="Request Pricing">
        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Name</label>
            <input 
              type="text" 
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Email</label>
            <input 
              type="email" 
              placeholder="work@company.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                color: 'var(--fg-0)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Company Size</label>
            <select style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-0)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-1)',
              color: 'var(--fg-0)',
              fontSize: '14px',
              fontFamily: 'var(--font-ui)',
              boxSizing: 'border-box',
            }}>
              <option>1-50 employees</option>
              <option>51-200 employees</option>
              <option>201-1000 employees</option>
              <option>1000+ employees</option>
            </select>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-ui)',
            }}>Estimated Assets</label>
            <select style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-0)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-1)',
              color: 'var(--fg-0)',
              fontSize: '14px',
              fontFamily: 'var(--font-ui)',
              boxSizing: 'border-box',
            }}>
              <option>Less than 100</option>
              <option>100-500</option>
              <option>500-2000</option>
              <option>2000+</option>
            </select>
          </div>
          <button 
            type="button" 
            onClick={() => setPricingModalOpen(false)}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-0)',
              border: 'none',
              borderRadius: 'var(--radius-1)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Request Pricing
          </button>
          <p style={{
            fontSize: '12px',
            color: 'var(--fg-1)',
            textAlign: 'center',
            margin: 0,
            fontFamily: 'var(--font-ui)',
          }}>
            This is a demo form. No data is submitted.
          </p>
        </form>
      </Modal>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
