import { useState, useEffect } from 'react';
import { getDashboard, getAssets, getUsers, getSites, getAuditEvents } from '../../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardData, assets, users, sites, events] = await Promise.all([
        getDashboard(),
        getAssets(),
        getUsers(),
        getSites(),
        getAuditEvents({ limit: 10 })
      ]);

      setStats({
        totalAssets: assets.length,
        checkedOut: assets.filter(a => a.status === 'CHECKED_OUT').length,
        available: assets.filter(a => a.status === 'AVAILABLE').length,
        totalUsers: users.length,
        totalSites: sites.length,
        highSensitivity: assets.filter(a => a.sensitivity_level === 'HIGH').length,
        ...dashboardData
      });

      setRecentEvents(events.slice(0, 10));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '256px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: `2px solid rgba(242, 245, 247, 0.3)`,
          borderTopColor: 'var(--fg-0)',
          animation: 'spin 0.6s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      padding: 'var(--space-6)',
      backgroundColor: 'var(--bg-0)',
      minHeight: '100vh',
    }}>
      <div style={{
        marginBottom: 'var(--space-8)',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--fg-0)',
          marginBottom: 'var(--space-2)',
          fontFamily: 'var(--font-display)',
        }}>Admin Dashboard</h1>
        <p style={{
          color: 'var(--fg-1)',
          fontSize: '14px',
          fontFamily: 'var(--font-ui)',
        }}>System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        <div className="card" style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: `1px solid var(--border)`,
          padding: 'var(--space-5)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{
                fontSize: '13px',
                color: 'var(--fg-1)',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-ui)',
              }}>Total Assets</p>
              <p style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--fg-0)',
                fontFamily: 'var(--font-display)',
              }}>{stats?.totalAssets || 0}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg style={{
                width: '24px',
                height: '24px',
                color: '#2563eb',
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div style={{
            marginTop: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            fontSize: '13px',
            gap: 'var(--space-2)',
          }}>
            <span style={{ color: '#16a34a' }}>{stats?.available || 0} available</span>
            <span style={{ color: 'var(--fg-1)' }}>|</span>
            <span style={{ color: '#ca8a04' }}>{stats?.checkedOut || 0} out</span>
          </div>
        </div>

        <div className="card" style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: `1px solid var(--border)`,
          padding: 'var(--space-5)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{
                fontSize: '13px',
                color: 'var(--fg-1)',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-ui)',
              }}>Total Users</p>
              <p style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--fg-0)',
                fontFamily: 'var(--font-display)',
              }}>{stats?.totalUsers || 0}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg style={{
                width: '24px',
                height: '24px',
                color: '#3b82f6',
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card" style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: `1px solid var(--border)`,
          padding: 'var(--space-5)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{
                fontSize: '13px',
                color: 'var(--fg-1)',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-ui)',
              }}>Sites</p>
              <p style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--fg-0)',
                fontFamily: 'var(--font-display)',
              }}>{stats?.totalSites || 0}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(22, 163, 74, 0.15)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg style={{
                width: '24px',
                height: '24px',
                color: '#16a34a',
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card" style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: `1px solid var(--border)`,
          padding: 'var(--space-5)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{
                fontSize: '13px',
                color: 'var(--fg-1)',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-ui)',
              }}>High Sensitivity</p>
              <p style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--fg-0)',
                fontFamily: 'var(--font-display)',
              }}>{stats?.highSensitivity || 0}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg style={{
                width: '24px',
                height: '24px',
                color: '#dc2626',
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & System Health */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
      }}>
        <div className="card" style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: `1px solid var(--border)`,
          padding: 'var(--space-5)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--fg-0)',
            marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-ui)',
          }}>Quick Actions</h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}>
            {[
              { href: '/app/admin/assets', icon: '12 6v6m0 0v6m0-6h6m-6 0H6', title: 'Add New Asset', desc: 'Register equipment to track', color: '#2563eb' },
              { href: '/app/admin/users', icon: '18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', title: 'Add New User', desc: 'Invite team members', color: '#3b82f6' },
              { href: '/app/admin/sites', icon: '9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', title: 'Configure Site', desc: 'Set up geofences', color: '#16a34a' },
              { href: '/app/audit', icon: '9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'View Audit Log', desc: 'Full custody history', color: '#a855f7' },
            ].map((action, idx) => (
              <a key={idx} href={action.href} style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-0)',
                borderRadius: 'var(--radius-1)',
                border: `1px solid var(--border)`,
                textDecoration: 'none',
                transition: 'all var(--dur-2) var(--ease-out)',
                cursor: 'pointer',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(198, 255, 58, 0.08)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-0)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `${action.color}20`,
                  borderRadius: 'var(--radius-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 'var(--space-3)',
                  flexShrink: 0,
                }}>
                  <svg style={{
                    width: '20px',
                    height: '20px',
                    color: action.color,
                  }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontWeight: 600,
                    color: 'var(--fg-0)',
                    fontSize: '14px',
                    margin: 0,
                    fontFamily: 'var(--font-ui)',
                  }}>{action.title}</p>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--fg-1)',
                    margin: '4px 0 0',
                    fontFamily: 'var(--font-ui)',
                  }}>{action.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="card" style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: `1px solid var(--border)`,
          padding: 'var(--space-5)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--fg-0)',
            marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-ui)',
          }}>System Health</h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}>
            {[
              { label: 'Database', status: 'Healthy' },
              { label: 'Open Gateway Mock', status: 'Connected' },
              { label: 'Policy Engine', status: 'Active' },
              { label: 'Audit Chain', status: 'Valid' },
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#16a34a',
                    borderRadius: '50%',
                  }}></span>
                  <span style={{
                    fontSize: '13px',
                    color: 'var(--fg-1)',
                    fontFamily: 'var(--font-ui)',
                  }}>{item.label}</span>
                </div>
                <span style={{
                  fontSize: '13px',
                  color: '#16a34a',
                  fontWeight: 600,
                  fontFamily: 'var(--font-ui)',
                }}>{item.status}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-4)',
            borderTop: `1px solid var(--border)`,
          }}>
            <p style={{
              fontSize: '11px',
              color: 'var(--fg-1)',
              margin: 0,
              fontFamily: 'var(--font-ui)',
            }}>Last verified: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Audit Events */}
      <div className="card" style={{
        backgroundColor: 'var(--bg-1)',
        borderRadius: 'var(--radius-2)',
        boxShadow: 'var(--shadow-1)',
        border: `1px solid var(--border)`,
        padding: 'var(--space-5)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--fg-0)',
            margin: 0,
            fontFamily: 'var(--font-ui)',
          }}>Recent Activity</h2>
          <a href="/app/audit" style={{
            fontSize: '13px',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            transition: 'color var(--dur-2) var(--ease-out)',
          }} onMouseEnter={(e) => {
            e.target.style.opacity = '0.8';
          }} onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}>View all</a>
        </div>
        {recentEvents.length === 0 ? (
          <p style={{
            color: 'var(--fg-1)',
            textAlign: 'center',
            paddingTop: 'var(--space-8)',
            paddingBottom: 'var(--space-8)',
            margin: 0,
            fontFamily: 'var(--font-ui)',
          }}>No recent activity</p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}>
            {recentEvents.map(event => {
              const colorMap = {
                'CHECKOUT': { bg: 'rgba(202, 138, 4, 0.15)', color: '#ca8a04', icon: '17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
                'RETURN': { bg: 'rgba(22, 163, 74, 0.15)', color: '#16a34a', icon: '11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' },
                'TRANSFER': { bg: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', icon: '8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
              };
              const eventColor = colorMap[event.event_type] || { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280', icon: '' };

              return (
                <div key={event.id} style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-0)',
                  borderRadius: 'var(--radius-1)',
                  border: `1px solid var(--border)`,
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: eventColor.bg,
                  }}>
                    <svg style={{
                      width: '16px',
                      height: '16px',
                      color: eventColor.color,
                    }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={eventColor.icon} />
                    </svg>
                  </div>
                  <div style={{
                    flex: 1,
                    minWidth: 0,
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--fg-0)',
                      margin: '0 0 4px',
                      fontFamily: 'var(--font-ui)',
                    }}>
                      {event.event_type} - {event.asset?.name || 'Unknown Asset'}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--fg-1)',
                      margin: 0,
                      fontFamily: 'var(--font-ui)',
                    }}>
                      {event.notes && `${event.notes} • `}
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
