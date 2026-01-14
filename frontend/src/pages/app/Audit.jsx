import { useState, useEffect } from 'react';
import { getAuditEvents, verifyAuditChain } from '../../utils/api';

export default function Audit() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chainValid, setChainValid] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [filters, setFilters] = useState({
    event_type: '',
    decision: '',
  });

  const [verifyHovered, setVerifyHovered] = useState(false);
  const [applyHovered, setApplyHovered] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const params = {};
      if (filters.event_type) params.event_type = filters.event_type;
      if (filters.decision) params.decision = filters.decision;
      
      const data = await getAuditEvents(params);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const result = await verifyAuditChain();
      setChainValid(result.valid);
    } catch (err) {
      console.error('Failed to verify chain:', err);
      setChainValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const getEventIcon = (type) => {
    const style = { width: '16px', height: '16px' };
    switch (type) {
      case 'CHECKOUT':
        return (
          <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      case 'RETURN':
        return (
          <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        );
      case 'TRANSFER':
        return (
          <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return (
          <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getDecisionBadgeStyle = (decision) => {
    const base = { padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 };
    if (decision === 'ALLOW') return { ...base, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80' };
    if (decision === 'DENY') return { ...base, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' };
    if (decision === 'STEP_UP') return { ...base, backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
  };

  const getEventIconStyle = (type) => {
    const base = { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
    if (type === 'CHECKOUT') return { ...base, backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' };
    if (type === 'RETURN') return { ...base, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80' };
    if (type === 'TRANSFER') return { ...base, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    padding: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-0)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '14px',
    fontFamily: 'var(--font-ui)',
  };

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
    <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--bg-0)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>Audit Trail</h1>
          <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '4px' }}>Complete custody history with tamper-evident chain</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {chainValid !== null && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-1)',
              backgroundColor: chainValid ? 'rgba(22, 163, 74, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: chainValid ? '#4ade80' : '#f87171',
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {chainValid ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{chainValid ? 'Chain Valid' : 'Chain Invalid'}</span>
            </div>
          )}
          <button
            onClick={handleVerifyChain}
            disabled={verifying}
            onMouseEnter={() => setVerifyHovered(true)}
            onMouseLeave={() => setVerifyHovered(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: verifyHovered && !verifying ? 'var(--bg-0)' : 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-1)',
              color: 'var(--fg-0)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: verifying ? 'not-allowed' : 'pointer',
              opacity: verifying ? 0.6 : 1,
              transition: 'background-color 0.2s',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {verifying ? 'Verifying...' : 'Verify Chain'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '12px' }}>Filters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--fg-1)', marginBottom: '6px' }}>Event Type</label>
            <select
              value={filters.event_type}
              onChange={(e) => setFilters({ ...filters, event_type: e.target.value })}
              style={inputStyle}
            >
              <option value="">All Types</option>
              <option value="CHECKOUT">Checkout</option>
              <option value="RETURN">Return</option>
              <option value="TRANSFER">Transfer</option>
              <option value="INVENTORY_CLOSE">Inventory Close</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--fg-1)', marginBottom: '6px' }}>Decision</label>
            <select
              value={filters.decision}
              onChange={(e) => setFilters({ ...filters, decision: e.target.value })}
              style={inputStyle}
            >
              <option value="">All Decisions</option>
              <option value="ALLOW">Allow</option>
              <option value="DENY">Deny</option>
              <option value="STEP_UP">Step Up</option>
            </select>
          </div>
          <div>
            <button
              onClick={loadEvents}
              onMouseEnter={() => setApplyHovered(true)}
              onMouseLeave={() => setApplyHovered(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: applyHovered ? '#d4ff5a' : 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                color: '#0b0d10',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Chain Explanation */}
      <div style={{
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: 'var(--radius-2)',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <svg style={{ width: '20px', height: '20px', color: '#a855f7', marginTop: '2px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <div>
            <h3 style={{ fontWeight: 500, color: '#c084fc', margin: 0, fontSize: '14px' }}>Tamper-Evident Hash Chain</h3>
            <p style={{ fontSize: '13px', color: '#d8b4fe', marginTop: '6px', lineHeight: 1.5 }}>
              Each audit event contains a hash of the previous event, creating an immutable chain. 
              If any historical record is modified, the chain verification will fail, ensuring 
              complete audit integrity for compliance and legal purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      {events.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
          <svg style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: 'var(--fg-1)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p style={{ color: 'var(--fg-1)' }}>No audit events found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {events.map((event) => (
            <div key={event.id} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                {/* Event Icon */}
                <div style={getEventIconStyle(event.event_type)}>
                  {getEventIcon(event.event_type)}
                </div>

                {/* Event Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--fg-0)', fontSize: '14px' }}>{event.event_type}</span>
                      <span style={{ color: 'var(--fg-1)', margin: '0 8px' }}>•</span>
                      <span style={{ color: 'var(--fg-0)', fontSize: '14px' }}>{event.asset?.name || 'Unknown Asset'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={getDecisionBadgeStyle(event.decision)}>{event.decision}</span>
                      <span style={{ fontSize: '12px', color: 'var(--fg-1)' }}>#{event.id}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', fontSize: '13px', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--fg-1)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actor</p>
                      <p style={{ color: 'var(--fg-0)', margin: 0 }}>{event.actor?.full_name || 'System'}</p>
                    </div>
                    {event.target_user && (
                      <div>
                        <p style={{ fontSize: '11px', color: 'var(--fg-1)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target User</p>
                        <p style={{ color: 'var(--fg-0)', margin: 0 }}>{event.target_user.full_name}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--fg-1)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Site</p>
                      <p style={{ color: 'var(--fg-0)', margin: 0 }}>{event.site?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--fg-1)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Timestamp</p>
                      <p style={{ color: 'var(--fg-0)', margin: 0 }}>{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Verification Results */}
                  {event.verification_results && Object.keys(event.verification_results).length > 0 && (
                    <div style={{
                      backgroundColor: 'var(--bg-0)',
                      borderRadius: 'var(--radius-1)',
                      padding: '12px',
                      marginBottom: '12px',
                      border: '1px solid var(--border)',
                    }}>
                      <p style={{ fontSize: '11px', color: 'var(--fg-1)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verification Results</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {Object.entries(event.verification_results).map(([key, value]) => (
                          <span
                            key={key}
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              borderRadius: 'var(--radius-1)',
                              backgroundColor: value === true || value === 'VERIFIED'
                                ? 'rgba(22, 163, 74, 0.15)'
                                : value === false
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(107, 114, 128, 0.15)',
                              color: value === true || value === 'VERIFIED'
                                ? '#4ade80'
                                : value === false
                                ? '#f87171'
                                : 'var(--fg-1)',
                            }}
                          >
                            {key}: {typeof value === 'boolean' ? (
                              value ? (
                                <svg style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                              ) : (
                                <svg style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                              )
                            ) : String(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hash Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--fg-1)' }}>
                      <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-mono)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={event.event_hash}>
                        {event.event_hash?.substring(0, 16)}...
                      </span>
                    </div>
                    {event.prev_hash && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--fg-1)' }}>
                        <span>← prev:</span>
                        <span style={{ fontFamily: 'var(--font-mono)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={event.prev_hash}>
                          {event.prev_hash.substring(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
