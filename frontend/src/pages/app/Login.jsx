import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login as apiLogin } from '../../utils/api';
import { useI18n } from '../../i18n';

export default function Login() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiLogin(email, password);
      login(response.token, response.user);
      
      // Redirect based on role
      if (response.user.role === 'ADMIN') {
        navigate('/app/admin');
      } else if (response.user.role === 'MANAGER') {
        navigate('/app/manager/approvals');
      } else {
        navigate('/app/employee');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@geocustody.com', password: 'admin123' },
    { role: 'Manager', email: 'manager@geocustody.com', password: 'manager123' },
    { role: 'Employee', email: 'john@geocustody.com', password: 'employee123' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-0)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '384px',
        height: '384px',
        backgroundColor: 'var(--accent)',
        borderRadius: '50%',
        filter: 'blur(96px)',
        opacity: 0.05,
        zIndex: -1,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '384px',
        height: '384px',
        backgroundColor: 'var(--accent2)',
        borderRadius: '50%',
        filter: 'blur(96px)',
        opacity: 0.05,
        zIndex: -1,
      }} />

      <div style={{
        position: 'relative',
        margin: '0 auto',
        width: '100%',
        maxWidth: '448px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-8)',
          textDecoration: 'none',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--accent)',
            borderRadius: 'var(--radius-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-2)',
          }}>
            <svg viewBox="0 0 24 24" style={{
              width: '40px',
              height: '40px',
              color: 'var(--bg-0)',
            }} fill="currentColor">
              <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
            </svg>
          </div>
        </Link>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-8)',
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--fg-0)',
            marginBottom: 'var(--space-2)',
            fontFamily: 'var(--font-display)',
          }}>
            {t('login') || 'Welcome'}
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--fg-1)',
            fontFamily: 'var(--font-ui)',
          }}>
            Sign in to GeoCustody to manage your assets
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-2)',
          border: `1px solid var(--border)`,
          padding: 'var(--space-6)',
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}>
            {/* Error Alert */}
            {error && (
              <div style={{
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: 'var(--radius-1)',
                padding: 'var(--space-3) var(--space-4)',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'flex-start',
              }}>
                <svg style={{
                  width: '20px',
                  height: '20px',
                  color: '#dc2626',
                  flexShrink: 0,
                  marginTop: '2px',
                }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p style={{
                  fontSize: '14px',
                  color: '#dc2626',
                  fontWeight: 500,
                  margin: 0,
                }}>{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--fg-0)',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-ui)',
              }}>Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: `var(--space-3) var(--space-4)`,
                  backgroundColor: 'var(--bg-0)',
                  border: `1px solid var(--border)`,
                  borderRadius: 'var(--radius-1)',
                  color: 'var(--fg-0)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-ui)',
                  transition: 'all var(--dur-2) var(--ease-out)',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = 'var(--shadow-focus)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--fg-0)',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-ui)',
              }}>{t('password') || 'Password'}</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: `var(--space-3) var(--space-4)`,
                  backgroundColor: 'var(--bg-0)',
                  border: `1px solid var(--border)`,
                  borderRadius: 'var(--radius-1)',
                  color: 'var(--fg-0)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-ui)',
                  transition: 'all var(--dur-2) var(--ease-out)',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = 'var(--shadow-focus)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 'var(--space-8)',
                padding: `var(--space-4) var(--space-5)`,
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-0)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'var(--font-ui)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all var(--dur-2) var(--ease-out)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = 'var(--shadow-2)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid rgba(11, 13, 16, 0.3)`,
                    borderTopColor: 'var(--bg-0)',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  {t('loading') || 'Signing in...'}
                </>
              ) : (
                t('login') || 'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            position: 'relative',
            margin: `var(--space-8) 0`,
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'var(--border)',
              }} />
            </div>
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              fontSize: '13px',
            }}>
              <span style={{
                padding: `0 var(--space-3)`,
                backgroundColor: 'var(--bg-1)',
                color: 'var(--fg-1)',
                fontWeight: 500,
              }}>Demo Credentials</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}>
            {demoCredentials.map((cred) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: 'var(--space-3)',
                  marginBottom: 0,
                  backgroundColor: 'transparent',
                  border: `1px solid var(--border)`,
                  borderRadius: 'var(--radius-1)',
                  cursor: 'pointer',
                  transition: 'all var(--dur-2) var(--ease-out)',
                  fontFamily: 'var(--font-ui)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-0)';
                  e.target.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                <span style={{
                  fontWeight: 600,
                  color: 'var(--fg-0)',
                  fontSize: '14px',
                }}>{cred.role}</span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--fg-1)',
                  marginTop: 'var(--space-1)',
                }}>{cred.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <p style={{
          marginTop: 'var(--space-8)',
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--fg-1)',
          margin: `var(--space-8) 0 0`,
        }}>
          <Link to="/" style={{
            color: 'var(--accent)',
            fontWeight: 600,
            transition: 'color var(--dur-2) var(--ease-out)',
            textDecoration: 'none',
          }} onMouseEnter={(e) => {
            e.target.style.opacity = '0.8';
          }} onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}>
            ← Back to home
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
