import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MockNetworkPanel from '../MockNetworkPanel';

export default function AppLayout() {
  const { user, logout, isAdmin, isManager } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/app/login');
  };

  const navItems = [
    { href: '/app/employee', label: 'Dashboard', icon: 'home', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
    { href: '/app/employee/assets', label: 'Assets', icon: 'box', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
    { href: '/app/employee/scan', label: 'Scan', icon: 'scan', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
    { href: '/app/manager/approvals', label: 'Approvals', icon: 'check', roles: ['MANAGER', 'ADMIN'] },
    { href: '/app/admin', label: 'Admin Dashboard', icon: 'chart', roles: ['ADMIN'] },
    { href: '/app/admin/assets', label: 'Manage Assets', icon: 'settings', roles: ['ADMIN'] },
    { href: '/app/admin/sites', label: 'Sites', icon: 'map', roles: ['ADMIN'] },
    { href: '/app/admin/users', label: 'Users', icon: 'users', roles: ['ADMIN'] },
    { href: '/app/admin/policies', label: 'Policies', icon: 'shield', roles: ['ADMIN'] },
    { href: '/app/audit', label: 'Audit Trail', icon: 'list', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  const getIcon = (name) => {
    const icons = {
      home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
      box: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
      scan: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />,
      check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
      chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
      map: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
      users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
      shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
      list: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    };
    return icons[name] || icons.home;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-0)',
      display: 'flex',
    }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '256px',
        backgroundColor: 'var(--bg-1)',
        borderRight: '1px solid var(--border)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--dur-3) var(--ease-out)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
      }} className="sidebar-desktop">
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-5) var(--space-5)',
          borderBottom: '1px solid var(--border)',
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            textDecoration: 'none',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--accent)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '24px',
                height: '24px',
                color: 'var(--bg-0)',
              }} fill="currentColor">
                <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
              </svg>
            </div>
            <div>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--fg-0)',
                fontFamily: 'var(--font-ui)',
              }}>GeoCustody</span>
              <p style={{
                fontSize: '12px',
                color: 'var(--fg-1)',
                margin: 0,
                fontFamily: 'var(--font-ui)',
              }}>Asset Management</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: 'var(--space-4) var(--space-3)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {filteredNav.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-ui)',
                  textDecoration: 'none',
                  transition: 'all var(--dur-2) var(--ease-out)',
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'var(--bg-0)' : 'var(--fg-1)',
                }}
                onClick={() => setSidebarOpen(false)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(198, 255, 58, 0.1)';
                    e.currentTarget.style.color = 'var(--fg-0)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--fg-1)';
                  }
                }}
              >
                <svg style={{
                  width: '20px',
                  height: '20px',
                  flexShrink: 0,
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {getIcon(item.icon)}
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{
          padding: '0 var(--space-4)',
        }}>
          <div style={{
            height: '1px',
            backgroundColor: 'var(--border)',
          }} />
        </div>

        {/* User info */}
        <div style={{
          padding: 'var(--space-4)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(198, 255, 58, 0.15)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontWeight: 600,
              color: 'var(--accent)',
              fontFamily: 'var(--font-ui)',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{
              flex: 1,
              minWidth: 0,
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--fg-0)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-ui)',
              }}>{user?.name}</p>
              <p style={{
                fontSize: '12px',
                color: 'var(--fg-1)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-ui)',
              }}>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: 'var(--space-2)',
                color: 'var(--fg-1)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                cursor: 'pointer',
                transition: 'all var(--dur-2) var(--ease-out)',
              }}
              title="Logout"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.15)';
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--fg-1)';
              }}
            >
              <svg style={{
                width: '20px',
                height: '20px',
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          className="sidebar-overlay-mobile"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        marginLeft: '256px',
      }} className="main-content-area">
        {/* Top bar */}
        <header style={{
          backgroundColor: 'var(--bg-1)',
          borderBottom: '1px solid var(--border)',
          padding: 'var(--space-3) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          <button
            style={{
              padding: 'var(--space-2)',
              marginLeft: 'calc(-1 * var(--space-2))',
              color: 'var(--fg-0)',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-1)',
              cursor: 'pointer',
              display: 'none',
            }}
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <svg style={{
              width: '24px',
              height: '24px',
            }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div style={{ flex: 1 }} />
          <span style={{
            fontSize: '13px',
            color: 'var(--fg-1)',
            fontWeight: 500,
            fontFamily: 'var(--font-ui)',
          }}>
            {user?.email}
          </span>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: 'var(--space-6)',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-0)',
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mock Network Panel */}
      <MockNetworkPanel />

      <style>{`
        @media (min-width: 1024px) {
          .sidebar-desktop {
            transform: translateX(0) !important;
          }
        }
        @media (max-width: 1023px) {
          .main-content-area {
            margin-left: 0 !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
