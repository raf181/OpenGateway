import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAsset, getSites, getUsers, getAuditEvents, checkoutAsset, returnAsset, transferAsset } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useMockNetwork } from '../../../contexts/MockNetworkContext';
import Modal from '../../../components/Modal';

const StatusIcon = ({ type, size = 16, color }) => {
  const style = { width: `${size}px`, height: `${size}px`, color: color || 'currentColor' };
  
  switch (type) {
    case 'success':
      return (
        <svg style={style} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.42L8.5 12.086l6.793-6.796a1 1 0 011.411 0z" clipRule="evenodd" />
        </svg>
      );
    case 'error':
      return (
        <svg style={style} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-11.536a1 1 0 00-1.414-1.414L10 7.172 7.879 5.05a1 1 0 10-1.415 1.415L8.586 8.586 6.464 10.707a1 1 0 101.415 1.415L10 10l2.121 2.122a1 1 0 001.415-1.415L11.414 8.586l2.122-2.122z" clipRule="evenodd" />
        </svg>
      );
    case 'warning':
      return (
        <svg style={style} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.593C19.02 16.345 18.18 18 16.518 18H3.482c-1.662 0-2.502-1.655-1.743-3.308L8.257 3.1zM10 13a1 1 0 100 2 1 1 0 000-2zm-.75-6.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4z" clipRule="evenodd" />
        </svg>
      );
    case 'location':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4-4.667 6-8 6-11a6 6 0 10-12 0c0 3 2 6.333 6 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case 'lock':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="6" y="10" width="12" height="10" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7a3 3 0 016 0v3" />
        </svg>
      );
    case 'phone':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
          <circle cx="12" cy="5" r="1" />
        </svg>
      );
    default:
      return null;
  }
};

function RawResponseViewer({ data, title }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  if (!data) return null;
  
  return (
    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: hovered ? 'var(--fg-0)' : 'var(--fg-1)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'var(--font-ui)',
        }}
      >
        <svg 
          style={{ 
            width: '12px', 
            height: '12px', 
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {title || 'View Raw Response'}
      </button>
      {expanded && (
        <pre style={{
          marginTop: '8px',
          padding: '12px',
          backgroundColor: 'var(--bg-0)',
          color: '#4ade80',
          borderRadius: 'var(--radius-1)',
          fontSize: '11px',
          overflow: 'auto',
          maxHeight: '256px',
          fontFamily: 'var(--font-mono)',
          border: '1px solid var(--border)',
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function AssetDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { mockContext, setPanelOpen } = useMockNetwork();
  
  const [asset, setAsset] = useState(null);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [actionModal, setActionModal] = useState(null);
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [actionResult, setActionResult] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Button hover states
  const [checkoutHovered, setCheckoutHovered] = useState(false);
  const [returnHovered, setReturnHovered] = useState(false);
  const [transferHovered, setTransferHovered] = useState(false);
  const [mockConfigHovered, setMockConfigHovered] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [assetData, sitesData, usersData, eventsData] = await Promise.all([
          getAsset(id),
          getSites(),
          getUsers().catch(() => []),
          getAuditEvents({ asset_id: id, limit: 20 })
        ]);
        setAsset(assetData);
        setSites(sitesData);
        setUsers(usersData);
        setEvents(eventsData);
        if (assetData.current_site_id) {
          setSelectedSite(assetData.current_site_id.toString());
        } else if (sitesData.length > 0) {
          setSelectedSite(sitesData[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load asset:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setActionResult(null);

    try {
      const payload = {
        asset_id: parseInt(id),
        site_id: parseInt(selectedSite),
        mock_context: mockContext
      };

      let result;
      if (action === 'checkout') {
        result = await checkoutAsset(payload);
      } else if (action === 'return') {
        result = await returnAsset(payload);
      } else if (action === 'transfer') {
        result = await transferAsset({ ...payload, target_user_id: parseInt(selectedUser) });
      }

      setActionResult(result);
      
      if (result.success) {
        const updatedAsset = await getAsset(id);
        setAsset(updatedAsset);
        const updatedEvents = await getAuditEvents({ asset_id: id, limit: 20 });
        setEvents(updatedEvents);
      }
    } catch (err) {
      setActionResult({
        success: false,
        decision: 'ERROR',
        reason: err.message,
        message: 'Action failed'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    padding: '24px',
  };

  const labelStyle = {
    fontSize: '13px',
    color: 'var(--fg-1)',
    marginBottom: '4px',
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--fg-0)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'var(--bg-0)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '14px',
    fontFamily: 'var(--font-ui)',
  };

  const primaryButtonStyle = (hovered, disabled) => ({
    width: '100%',
    padding: '10px 16px',
    backgroundColor: disabled ? 'rgba(198, 255, 58, 0.3)' : (hovered ? '#d4ff5a' : 'var(--accent)'),
    border: 'none',
    borderRadius: 'var(--radius-1)',
    color: '#0b0d10',
    fontSize: '14px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 0.2s',
    fontFamily: 'var(--font-ui)',
  });

  const secondaryButtonStyle = (hovered, disabled) => ({
    width: '100%',
    padding: '10px 16px',
    backgroundColor: hovered && !disabled ? 'var(--bg-0)' : 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 0.2s',
    fontFamily: 'var(--font-ui)',
  });

  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '13px',
      fontWeight: 500,
    };
    if (status === 'AVAILABLE') return { ...base, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80' };
    if (status === 'CHECKED_OUT') return { ...base, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
  };

  const getSensitivityBadgeStyle = (sensitivity) => {
    const base = {
      display: 'inline-flex',
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
    };
    if (sensitivity === 'HIGH') return { ...base, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' };
    if (sensitivity === 'MEDIUM') return { ...base, backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
  };

  const getDecisionBadgeStyle = (decision) => {
    const base = {
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
    };
    if (decision === 'ALLOW') return { ...base, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80' };
    if (decision === 'DENY') return { ...base, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' };
    if (decision === 'STEP_UP') return { ...base, backgroundColor: 'rgba(202, 138, 4, 0.15)', color: '#fbbf24' };
    return { ...base, backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--fg-1)' };
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
          border: '2px solid rgba(242, 245, 247, 0.3)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.6s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!asset) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ color: 'var(--fg-1)', marginBottom: '8px' }}>Asset not found</p>
        <Link to="/app/employee/assets" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          ← Back to assets
        </Link>
      </div>
    );
  }

  const canCheckout = asset.status === 'AVAILABLE';
  const canReturn = asset.status === 'CHECKED_OUT' && (asset.current_custodian_id === user.id || user.role !== 'EMPLOYEE');
  const canTransfer = asset.status === 'CHECKED_OUT' && (asset.current_custodian_id === user.id || user.role !== 'EMPLOYEE');

  return (
    <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--bg-0)', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/app/employee/assets" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to assets
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {/* Asset Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent)', marginBottom: '4px' }}>{asset.tag_id}</p>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>{asset.name}</h1>
              </div>
              <span style={getStatusBadgeStyle(asset.status)}>{asset.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <p style={labelStyle}>Type</p>
                <p style={valueStyle}>{asset.asset_type}</p>
              </div>
              {asset.serial && (
                <div>
                  <p style={labelStyle}>Serial</p>
                  <p style={valueStyle}>{asset.serial}</p>
                </div>
              )}
              <div>
                <p style={labelStyle}>Sensitivity</p>
                <span style={getSensitivityBadgeStyle(asset.sensitivity)}>{asset.sensitivity}</span>
              </div>
              <div>
                <p style={labelStyle}>Current Site</p>
                <p style={valueStyle}>{asset.site_name || 'Not assigned'}</p>
              </div>
              {asset.custodian_name && (
                <div>
                  <p style={labelStyle}>Current Custodian</p>
                  <p style={valueStyle}>{asset.custodian_name}</p>
                </div>
              )}
              {asset.description && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={labelStyle}>Description</p>
                  <p style={{ ...valueStyle, fontWeight: 400, color: 'var(--fg-1)' }}>{asset.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Custody Timeline */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--fg-0)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Custody History</h2>
            
            {events.length === 0 ? (
              <p style={{ color: 'var(--fg-1)', fontSize: '14px' }}>No custody events recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {events.map((event, index) => (
                  <div key={event.id} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: event.decision === 'ALLOW' ? '#16a34a' : event.decision === 'DENY' ? '#ef4444' : '#ca8a04',
                      }} />
                      {index < events.length - 1 && (
                        <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border)', marginTop: '4px' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--fg-0)', fontSize: '14px' }}>{event.action}</span>
                        <span style={getDecisionBadgeStyle(event.decision)}>{event.decision}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--fg-1)', margin: 0 }}>
                        by {event.actor_name} at {event.site_name || 'Unknown site'}
                        {event.target_user_name && ` → ${event.target_user_name}`}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--fg-1)', opacity: 0.7, marginTop: '4px' }}>
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link to="/app/audit" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '14px', marginTop: '16px', display: 'inline-block' }}>
              View full audit trail →
            </Link>
          </div>
        </div>

        {/* Actions Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--fg-0)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Actions</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setActionModal('checkout')}
                disabled={!canCheckout}
                onMouseEnter={() => setCheckoutHovered(true)}
                onMouseLeave={() => setCheckoutHovered(false)}
                style={primaryButtonStyle(checkoutHovered, !canCheckout)}
              >
                Check Out
              </button>
              
              <button
                onClick={() => setActionModal('return')}
                disabled={!canReturn}
                onMouseEnter={() => setReturnHovered(true)}
                onMouseLeave={() => setReturnHovered(false)}
                style={secondaryButtonStyle(returnHovered, !canReturn)}
              >
                Return
              </button>
              
              <button
                onClick={() => setActionModal('transfer')}
                disabled={!canTransfer}
                onMouseEnter={() => setTransferHovered(true)}
                onMouseLeave={() => setTransferHovered(false)}
                style={secondaryButtonStyle(transferHovered, !canTransfer)}
              >
                Transfer
              </button>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setPanelOpen(true)}
                onMouseEnter={() => setMockConfigHovered(true)}
                onMouseLeave={() => setMockConfigHovered(false)}
                style={{
                  width: '100%',
                  fontSize: '14px',
                  color: mockConfigHovered ? '#fb923c' : '#ea580c',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                Configure Mock Network
              </button>
            </div>
          </div>

          {/* Mock Status */}
          <div style={{
            ...cardStyle,
            backgroundColor: 'rgba(234, 88, 12, 0.1)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fb923c', marginBottom: '12px' }}>Mock Network Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#fdba74' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <StatusIcon
                  type={mockContext.claimed_phone === mockContext.network_phone ? 'success' : 'error'}
                  size={16}
                  color={mockContext.claimed_phone === mockContext.network_phone ? '#4ade80' : '#f87171'}
                />
                <span>Phone: {mockContext.claimed_phone === mockContext.network_phone ? 'Match' : 'Mismatch'}</span>
              </p>
              <p style={{ margin: 0 }}>Location: {mockContext.network_lat.toFixed(4)}, {mockContext.network_lon.toFixed(4)}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <StatusIcon
                  type={mockContext.sim_swap_recent ? 'warning' : 'success'}
                  size={16}
                  color={mockContext.sim_swap_recent ? '#fbbf24' : '#4ade80'}
                />
                <span>SIM Swap: {mockContext.sim_swap_recent ? 'Recent' : 'None'}</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <StatusIcon
                  type={mockContext.device_swap_recent ? 'warning' : 'success'}
                  size={16}
                  color={mockContext.device_swap_recent ? '#fbbf24' : '#4ade80'}
                />
                <span>Device Swap: {mockContext.device_swap_recent ? 'Recent' : 'None'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        open={!!actionModal}
        onClose={() => {
          setActionModal(null);
          setActionResult(null);
        }}
        title={
          actionModal === 'checkout' ? 'Check Out Asset' :
          actionModal === 'return' ? 'Return Asset' :
          'Transfer Asset'
        }
      >
        {actionResult ? (
          <div>
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-1)',
              marginBottom: '16px',
              backgroundColor: actionResult.success ? 'rgba(22, 163, 74, 0.1)' : 
                actionResult.decision === 'STEP_UP' ? 'rgba(202, 138, 4, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${actionResult.success ? 'rgba(22, 163, 74, 0.3)' : 
                actionResult.decision === 'STEP_UP' ? 'rgba(202, 138, 4, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={getDecisionBadgeStyle(actionResult.decision)}>{actionResult.decision}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: actionResult.success ? '#4ade80' : actionResult.decision === 'STEP_UP' ? '#fbbf24' : '#f87171',
                }}>
                  {actionResult.message}
                </span>
              </div>
              <p style={{
                fontSize: '14px',
                margin: 0,
                color: actionResult.success ? '#86efac' : actionResult.decision === 'STEP_UP' ? '#fcd34d' : '#fca5a5',
              }}>
                {actionResult.reason}
              </p>
              
              {actionResult.approval_id && (
                <p style={{ fontSize: '14px', color: '#fcd34d', marginTop: '8px' }}>
                  Approval request #{actionResult.approval_id} created for manager review.
                </p>
              )}
            </div>

            {actionResult.verification && (
              <div style={{
                backgroundColor: 'var(--bg-0)',
                borderRadius: 'var(--radius-1)',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid var(--border)',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--fg-0)', marginBottom: '12px' }}>Verification Results</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StatusIcon type={actionResult.verification.number_verified ? 'success' : 'error'} size={16} color={actionResult.verification.number_verified ? '#4ade80' : '#f87171'} />
                    <span style={{ color: 'var(--fg-0)' }}>Number Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StatusIcon type={actionResult.verification.inside_geofence ? 'success' : 'error'} size={16} color={actionResult.verification.inside_geofence ? '#4ade80' : '#f87171'} />
                    <span style={{ color: 'var(--fg-0)' }}>Inside Geofence</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StatusIcon type={!actionResult.verification.sim_swap_detected ? 'success' : 'warning'} size={16} color={!actionResult.verification.sim_swap_detected ? '#4ade80' : '#fbbf24'} />
                    <span style={{ color: 'var(--fg-0)' }}>SIM Swap: {actionResult.verification.sim_swap_detected ? 'Detected' : 'None'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StatusIcon type={!actionResult.verification.device_swap_detected ? 'success' : 'warning'} size={16} color={!actionResult.verification.device_swap_detected ? '#4ade80' : '#fbbf24'} />
                    <span style={{ color: 'var(--fg-0)' }}>Device Swap: {actionResult.verification.device_swap_detected ? 'Detected' : 'None'}</span>
                  </div>
                </div>

                {actionResult.verification.details && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <h5 style={{ fontWeight: 500, color: 'var(--fg-1)', margin: 0 }}>API Details</h5>
                    
                    {actionResult.verification.details.location_verification && (
                      <div style={{ backgroundColor: 'var(--bg-1)', borderRadius: 'var(--radius-1)', padding: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 500, color: 'var(--fg-0)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <StatusIcon type="location" size={16} color="var(--accent)" />
                          <span>Location Verification</span>
                        </div>
                        <div style={{ color: 'var(--fg-1)' }}>
                          <p style={{ margin: '2px 0' }}>Result: <span style={{ fontFamily: 'var(--font-mono)' }}>{actionResult.verification.details.location_verification.verification_result}</span></p>
                          {actionResult.verification.details.location_verification.match_rate !== null && (
                            <p style={{ margin: '2px 0' }}>Match Rate: <span style={{ fontFamily: 'var(--font-mono)' }}>{actionResult.verification.details.location_verification.match_rate}%</span></p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {actionResult.verification.details.risk_signals && (
                      <div style={{ backgroundColor: 'var(--bg-1)', borderRadius: 'var(--radius-1)', padding: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 500, color: 'var(--fg-0)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <StatusIcon type="lock" size={16} color="var(--accent)" />
                          <span>Risk Signals</span>
                        </div>
                        <div style={{ color: 'var(--fg-1)' }}>
                          <p style={{ margin: '2px 0' }}>SIM Swap: <span style={{ fontFamily: 'var(--font-mono)', color: actionResult.verification.details.risk_signals.sim_swap_recent ? '#fbbf24' : '#4ade80' }}>
                            {actionResult.verification.details.risk_signals.sim_swap_recent ? 'Yes' : 'No'}
                          </span></p>
                          <p style={{ margin: '2px 0' }}>Device Swap: <span style={{ fontFamily: 'var(--font-mono)', color: actionResult.verification.details.risk_signals.device_swap_recent ? '#fbbf24' : '#4ade80' }}>
                            {actionResult.verification.details.risk_signals.device_swap_recent ? 'Yes' : 'No'}
                          </span></p>
                        </div>
                      </div>
                    )}
                    
                    {actionResult.verification.details.number_verification && (
                      <div style={{ backgroundColor: 'var(--bg-1)', borderRadius: 'var(--radius-1)', padding: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 500, color: 'var(--fg-0)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <StatusIcon type="phone" size={16} color="var(--accent)" />
                          <span>Number Verification</span>
                        </div>
                        <div style={{ color: 'var(--fg-1)' }}>
                          <p style={{ margin: '2px 0' }}>Match: <span style={{ fontFamily: 'var(--font-mono)', color: actionResult.verification.details.number_verification.match ? '#4ade80' : '#f87171' }}>
                            {actionResult.verification.details.number_verification.match ? 'Yes' : 'No'}
                          </span></p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <RawResponseViewer data={actionResult.verification.details} title="View Raw API Response" />
              </div>
            )}

            <button
              onClick={() => {
                setActionModal(null);
                setActionResult(null);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                color: '#0b0d10',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--fg-1)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Site</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                style={inputStyle}
              >
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </div>

            {actionModal === 'transfer' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--fg-1)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transfer to</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select user...</option>
                  {users.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{
              backgroundColor: 'rgba(234, 88, 12, 0.1)',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              borderRadius: 'var(--radius-1)',
              padding: '12px',
            }}>
              <p style={{ fontSize: '12px', color: '#fb923c', margin: 0 }}>
                This action will be verified using the Mock Network Panel settings.
                <button
                  onClick={() => setPanelOpen(true)}
                  style={{
                    color: '#ea580c',
                    textDecoration: 'underline',
                    marginLeft: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Configure
                </button>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setActionModal(null)}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-1)',
                  color: 'var(--fg-0)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(actionModal)}
                disabled={actionLoading || (actionModal === 'transfer' && !selectedUser)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: 'var(--accent)',
                  border: 'none',
                  borderRadius: 'var(--radius-1)',
                  color: '#0b0d10',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: (actionLoading || (actionModal === 'transfer' && !selectedUser)) ? 'not-allowed' : 'pointer',
                  opacity: (actionLoading || (actionModal === 'transfer' && !selectedUser)) ? 0.5 : 1,
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
