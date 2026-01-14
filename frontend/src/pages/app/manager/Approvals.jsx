import { useState, useEffect } from 'react';
import { getApprovals, processApproval } from '../../../utils/api';

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const data = await getApprovals();
      setApprovals(data);
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setProcessing(id);
    try {
      await processApproval(id, { action });
      await loadApprovals();
    } catch (err) {
      console.error('Failed to process approval:', err);
    } finally {
      setProcessing(null);
    }
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').toLowerCase();
  };

  const getStatusBadgeStyle = (status) => {
    const base = { padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 };
    if (status === 'PENDING') return { ...base, backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' };
    if (status === 'APPROVED') return { ...base, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80' };
    if (status === 'REJECTED') return { ...base, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    padding: '20px',
  };

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const historyApprovals = approvals.filter(a => a.status !== 'PENDING');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid rgba(242, 245, 247, 0.3)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.6s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--bg-0)', minHeight: '100vh', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>Approval Requests</h1>
        <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '4px' }}>Review and process custody requests from your team</p>
      </div>

      {/* Pending Approvals */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--fg-0)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
          Pending Requests
          {pendingApprovals.length > 0 && (
            <span style={{
              backgroundColor: 'rgba(202, 138, 4, 0.15)',
              color: '#fbbf24',
              fontSize: '13px',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}>
              {pendingApprovals.length}
            </span>
          )}
        </h2>

        {pendingApprovals.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}>
            <svg style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: 'var(--fg-1)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={{ color: 'var(--fg-1)', margin: 0 }}>No pending approvals</p>
            <p style={{ color: 'var(--fg-1)', fontSize: '14px', opacity: 0.7, marginTop: '4px' }}>All requests have been processed</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingApprovals.map(approval => (
              <div key={approval.id} style={{ ...cardStyle, borderLeft: '4px solid #fbbf24' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontWeight: 600, color: 'var(--fg-0)', margin: 0, fontSize: '16px' }}>
                      {approval.asset?.name || 'Unknown Asset'}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--fg-1)', marginTop: '4px' }}>
                      Tag: {approval.asset?.tag_id || 'N/A'}
                    </p>
                  </div>
                  <span style={getStatusBadgeStyle(approval.status)}>{approval.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', fontSize: '14px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requested By</p>
                    <p style={{ fontWeight: 500, color: 'var(--fg-0)', margin: 0 }}>{approval.requester?.full_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</p>
                    <p style={{ fontWeight: 500, color: 'var(--fg-0)', margin: 0, textTransform: 'capitalize' }}>{formatAction(approval.requested_action)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sensitivity</p>
                    <p style={{ fontWeight: 500, color: 'var(--fg-0)', margin: 0 }}>{approval.asset?.sensitivity_level || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requested</p>
                    <p style={{ fontWeight: 500, color: 'var(--fg-0)', margin: 0 }}>
                      {new Date(approval.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {approval.justification && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-0)',
                    borderRadius: 'var(--radius-1)',
                    border: '1px solid var(--border)',
                  }}>
                    <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginBottom: '4px' }}>Justification:</p>
                    <p style={{ color: 'var(--fg-0)', margin: 0, fontSize: '14px' }}>{approval.justification}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <ApproveButton
                    onClick={() => handleAction(approval.id, 'APPROVED')}
                    disabled={processing === approval.id}
                    processing={processing === approval.id}
                  />
                  <RejectButton
                    onClick={() => handleAction(approval.id, 'REJECTED')}
                    disabled={processing === approval.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--fg-0)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>History</h2>

        {historyApprovals.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}>
            <p style={{ color: 'var(--fg-1)', margin: 0 }}>No approval history yet</p>
          </div>
        ) : (
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-0)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Asset</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requester</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {historyApprovals.map((approval, index) => (
                  <tr key={approval.id} style={{ borderTop: index > 0 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--fg-0)', fontSize: '14px' }}>{approval.asset?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--fg-1)' }}>{approval.asset?.tag_id}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-0)' }}>
                      {approval.requester?.full_name || 'Unknown'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-0)', textTransform: 'capitalize' }}>
                      {formatAction(approval.requested_action)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={getStatusBadgeStyle(approval.status)}>{approval.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--fg-1)' }}>
                      {new Date(approval.resolved_at || approval.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ApproveButton({ onClick, disabled, processing }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '10px 16px',
        backgroundColor: disabled ? 'rgba(198, 255, 58, 0.3)' : (hovered ? '#d4ff5a' : 'var(--accent)'),
        border: 'none',
        borderRadius: 'var(--radius-1)',
        color: '#0b0d10',
        fontSize: '14px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background-color 0.2s',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {processing ? 'Processing...' : 'Approve'}
    </button>
  );
}

function RejectButton({ onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '10px 16px',
        backgroundColor: hovered && !disabled ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: 'var(--radius-1)',
        color: '#f87171',
        fontSize: '14px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background-color 0.2s',
        fontFamily: 'var(--font-ui)',
      }}
    >
      Reject
    </button>
  );
}
