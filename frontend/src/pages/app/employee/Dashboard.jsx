import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getAssets, getSites, getApprovals } from '../../../utils/api';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ assets: 0, myAssets: 0, pendingApprovals: 0 });
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [assets, approvals] = await Promise.all([
          getAssets(),
          user.role !== 'EMPLOYEE' ? getApprovals() : Promise.resolve([])
        ]);
        
        const myAssets = assets.filter(a => a.current_custodian_id === user.id);
        
        setStats({
          assets: assets.length,
          myAssets: myAssets.length,
          pendingApprovals: approvals.length
        });
        
        setRecentAssets(assets.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

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
          border: '2px solid rgba(242, 245, 247, 0.3)',
          borderTopColor: 'var(--fg-0)',
          animation: 'spin 0.6s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{
        marginBottom: 'var(--space-8)',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--fg-0)',
          marginBottom: 'var(--space-2)',
          fontFamily: 'var(--font-display)',
        }}>Welcome, {user?.name}</h1>
        <p style={{
          color: 'var(--fg-1)',
          fontSize: '14px',
          fontFamily: 'var(--font-ui)',
          margin: 0,
        }}>Here's what's happening with your assets today.</p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-5)',
        marginBottom: 'var(--space-8)',
      }}>
        <div style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: '1px solid var(--border)',
          padding: 'var(--space-5)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}>
            <div style={{
              padding: 'var(--space-3)',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              borderRadius: 'var(--radius-1)',
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#2563eb' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--fg-0)',
                margin: 0,
                fontFamily: 'var(--font-display)',
              }}>{stats.assets}</p>
              <p style={{
                fontSize: '13px',
                color: 'var(--fg-1)',
                margin: 0,
                fontFamily: 'var(--font-ui)',
              }}>Total Assets</p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-1)',
          borderRadius: 'var(--radius-2)',
          boxShadow: 'var(--shadow-1)',
          border: '1px solid var(--border)',
          padding: 'var(--space-5)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}>
            <div style={{
              padding: 'var(--space-3)',
              backgroundColor: 'rgba(22, 163, 74, 0.15)',
              borderRadius: 'var(--radius-1)',
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--fg-0)',
                margin: 0,
                fontFamily: 'var(--font-display)',
              }}>{stats.myAssets}</p>
              <p style={{
                fontSize: '13px',
                color: 'var(--fg-1)',
                margin: 0,
                fontFamily: 'var(--font-ui)',
              }}>My Checked Out</p>
            </div>
          </div>
        </div>

        {user.role !== 'EMPLOYEE' && (
          <div style={{
            backgroundColor: 'var(--bg-1)',
            borderRadius: 'var(--radius-2)',
            boxShadow: 'var(--shadow-1)',
            border: '1px solid var(--border)',
            padding: 'var(--space-5)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}>
              <div style={{
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(202, 138, 4, 0.15)',
                borderRadius: 'var(--radius-1)',
              }}>
                <svg style={{ width: '24px', height: '24px', color: '#ca8a04' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--fg-0)',
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                }}>{stats.pendingApprovals}</p>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--fg-1)',
                  margin: 0,
                  fontFamily: 'var(--font-ui)',
                }}>Pending Approvals</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        {[
          { href: '/app/employee/scan', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', title: 'Scan Asset', desc: 'QR or NFC tag', color: '#2563eb' },
          { href: '/app/employee/assets', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'View Assets', desc: 'Browse catalog', color: '#16a34a' },
          { href: '/app/audit', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: 'Audit Trail', desc: 'View history', color: '#a855f7' },
        ].map((action, idx) => (
          <Link key={idx} to={action.href} style={{
            backgroundColor: 'var(--bg-1)',
            borderRadius: 'var(--radius-2)',
            boxShadow: 'var(--shadow-1)',
            border: '1px solid var(--border)',
            padding: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            textDecoration: 'none',
            transition: 'all var(--dur-2) var(--ease-out)',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-2)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-1)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}>
            <div style={{
              padding: 'var(--space-2)',
              backgroundColor: `${action.color}20`,
              borderRadius: 'var(--radius-1)',
            }}>
              <svg style={{ width: '20px', height: '20px', color: action.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <div>
              <p style={{
                fontWeight: 600,
                color: 'var(--fg-0)',
                margin: 0,
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
              }}>{action.title}</p>
              <p style={{
                fontSize: '12px',
                color: 'var(--fg-1)',
                margin: 0,
                fontFamily: 'var(--font-ui)',
              }}>{action.desc}</p>
            </div>
          </Link>
        ))}

        {user.role !== 'EMPLOYEE' && (
          <Link to="/app/manager/approvals" style={{
            backgroundColor: 'var(--bg-1)',
            borderRadius: 'var(--radius-2)',
            boxShadow: 'var(--shadow-1)',
            border: '1px solid var(--border)',
            padding: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            textDecoration: 'none',
            transition: 'all var(--dur-2) var(--ease-out)',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-2)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-1)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}>
            <div style={{
              padding: 'var(--space-2)',
              backgroundColor: 'rgba(202, 138, 4, 0.15)',
              borderRadius: 'var(--radius-1)',
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#ca8a04' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p style={{
                fontWeight: 600,
                color: 'var(--fg-0)',
                margin: 0,
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
              }}>Approvals</p>
              <p style={{
                fontSize: '12px',
                color: 'var(--fg-1)',
                margin: 0,
                fontFamily: 'var(--font-ui)',
              }}>{stats.pendingApprovals} pending</p>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Assets */}
      <div style={{
        backgroundColor: 'var(--bg-1)',
        borderRadius: 'var(--radius-2)',
        boxShadow: 'var(--shadow-1)',
        border: '1px solid var(--border)',
        padding: 'var(--space-5)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--fg-0)',
            margin: 0,
            fontFamily: 'var(--font-ui)',
          }}>Recent Assets</h2>
          <Link to="/app/employee/assets" style={{
            fontSize: '13px',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
          }}>
            View all →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{
                textAlign: 'left',
                fontSize: '13px',
                color: 'var(--fg-1)',
                borderBottom: '1px solid var(--border)',
              }}>
                <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>Tag ID</th>
                <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>Name</th>
                <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>Status</th>
                <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>Sensitivity</th>
                <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>Site</th>
              </tr>
            </thead>
            <tbody>
              {recentAssets.map(asset => (
                <tr key={asset.id} style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background-color var(--dur-2) var(--ease-out)',
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(198, 255, 58, 0.05)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                  <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                    <Link to={`/app/employee/assets/${asset.id}`} style={{
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}>
                      {asset.tag_id}
                    </Link>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--fg-0)', fontFamily: 'var(--font-ui)', fontSize: '14px' }}>{asset.name}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '4px 10px',
                      fontSize: '12px',
                      borderRadius: '9999px',
                      fontWeight: 500,
                      fontFamily: 'var(--font-ui)',
                      backgroundColor: asset.status === 'AVAILABLE' ? 'rgba(22, 163, 74, 0.15)' : 
                                       asset.status === 'CHECKED_OUT' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                      color: asset.status === 'AVAILABLE' ? '#16a34a' : 
                             asset.status === 'CHECKED_OUT' ? '#2563eb' : '#6b7280',
                    }}>
                      {asset.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '4px 10px',
                      fontSize: '12px',
                      borderRadius: '9999px',
                      fontWeight: 500,
                      fontFamily: 'var(--font-ui)',
                      backgroundColor: asset.sensitivity === 'HIGH' ? 'rgba(220, 38, 38, 0.15)' :
                                       asset.sensitivity === 'MEDIUM' ? 'rgba(202, 138, 4, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                      color: asset.sensitivity === 'HIGH' ? '#dc2626' :
                             asset.sensitivity === 'MEDIUM' ? '#ca8a04' : '#6b7280',
                    }}>
                      {asset.sensitivity}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--fg-1)', fontSize: '13px', fontFamily: 'var(--font-ui)' }}>{asset.site_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
