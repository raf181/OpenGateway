import { useState } from 'react';
import { useMockNetwork } from '../contexts/MockNetworkContext';
import { useGateway } from '../contexts/GatewayContext';

export default function MockNetworkPanel() {
  const { mockContext, updateMockContext, resetMockContext, panelOpen, setPanelOpen } = useMockNetwork();
  const { status, loading, isRealApi, isMockMode } = useGateway();
  const [buttonHovered, setButtonHovered] = useState(false);
  const [resetHovered, setResetHovered] = useState(false);

  // Determine button color based on mode
  const getButtonColor = () => {
    if (loading) return '#6b7280';
    if (isRealApi) return '#16a34a';
    return '#ea580c';
  };

  const getModeIcon = () => {
    if (loading) {
      return (
        <svg style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    if (isRealApi) {
      return (
        <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }
    return (
      <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    );
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-0)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '13px',
    fontFamily: 'var(--font-ui)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: 'var(--fg-1)',
    marginBottom: '4px',
    fontFamily: 'var(--font-ui)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const sectionTitleStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--fg-0)',
    marginBottom: '8px',
    fontFamily: 'var(--font-ui)',
  };

  const presetButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '4px 0',
    fontFamily: 'var(--font-ui)',
    display: 'block',
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 40,
          color: '#fff',
          padding: '12px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          backgroundColor: getButtonColor(),
          transform: buttonHovered ? 'scale(1.1)' : 'scale(1)',
        }}
        title={isRealApi ? `Telefónica API (${status.mode})` : 'Mock Network Panel'}
      >
        {getModeIcon()}
      </button>

      {/* Panel */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100%',
        width: '320px',
        backgroundColor: 'var(--bg-1)',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.4)',
        zIndex: 50,
        transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--fg-0)',
            fontFamily: 'var(--font-display)',
            margin: 0,
          }}>
            {isRealApi ? 'Telefónica Open Gateway' : 'Mock Network Panel'}
          </h3>
          <button
            onClick={() => setPanelOpen(false)}
            style={{
              padding: '4px',
              background: 'none',
              border: 'none',
              color: 'var(--fg-1)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-1)',
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '16px',
          overflowY: 'auto',
          height: 'calc(100% - 60px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Real API Mode Panel */}
          {isRealApi && (
            <>
              <div style={{
                backgroundColor: 'rgba(22, 163, 74, 0.15)',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                borderRadius: 'var(--radius-2)',
                padding: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    animation: 'pulse 2s infinite',
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4ade80',
                    fontFamily: 'var(--font-ui)',
                  }}>Live API Connected</span>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#86efac',
                  margin: 0,
                  fontFamily: 'var(--font-ui)',
                }}>
                  Using real Telefónica Open Gateway APIs in <strong>{status.mode}</strong> mode.
                </p>
              </div>

              <div>
                <h4 style={sectionTitleStyle}>Connection Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--fg-1)' }}>Mode:</span>
                    <span style={{
                      fontWeight: 600,
                      color: status.mode === 'production' ? '#ef4444' : '#3b82f6',
                    }}>
                      {status.mode.charAt(0).toUpperCase() + status.mode.slice(1)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--fg-1)' }}>Credentials:</span>
                    <span style={{ color: status.has_credentials ? '#16a34a' : '#ef4444' }}>
                      {status.has_credentials ? '✓ Configured' : '✗ Missing'}
                    </span>
                  </div>
                </div>
              </div>

              {status.available_apis && status.available_apis.length > 0 && (
                <div>
                  <h4 style={sectionTitleStyle}>Available APIs</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {status.available_apis.map((api) => (
                      <span key={api} style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        borderRadius: 'var(--radius-1)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {api}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-2)',
                padding: '12px',
              }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#60a5fa',
                  marginBottom: '8px',
                }}>How It Works</h4>
                <p style={{ fontSize: '11px', color: '#93c5fd', margin: 0 }}>
                  All custody verifications use real Telefónica network APIs:
                </p>
                <ul style={{
                  fontSize: '11px',
                  color: '#93c5fd',
                  margin: '8px 0 0 0',
                  paddingLeft: '16px',
                  listStyle: 'none',
                }}>
                  <li>• <strong>SIM Swap:</strong> Detects recent SIM changes</li>
                  <li>• <strong>Device Swap:</strong> Detects device changes</li>
                  <li>• <strong>Location:</strong> Verifies user position</li>
                  <li>• <strong>Number Verify:</strong> Confirms phone ownership</li>
                </ul>
              </div>

              {status.mode === 'sandbox' && (
                <div style={{
                  backgroundColor: 'rgba(202, 138, 4, 0.15)',
                  border: '1px solid rgba(202, 138, 4, 0.3)',
                  borderRadius: 'var(--radius-2)',
                  padding: '12px',
                }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#fbbf24',
                    marginBottom: '8px',
                  }}>⚠️ Sandbox Limitations</h4>
                  <ul style={{
                    fontSize: '11px',
                    color: '#fcd34d',
                    margin: 0,
                    paddingLeft: '16px',
                    listStyle: 'none',
                  }}>
                    <li>• Location accuracy limited to 200m</li>
                    <li>• Number Verification needs mobile network</li>
                    <li>• Test phone numbers may be required</li>
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Mock Mode Panel */}
          {isMockMode && (
            <>
              <div style={{
                backgroundColor: 'rgba(234, 88, 12, 0.15)',
                border: '1px solid rgba(234, 88, 12, 0.3)',
                borderRadius: 'var(--radius-2)',
                padding: '12px',
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#fb923c',
                  margin: 0,
                  fontFamily: 'var(--font-ui)',
                }}>
                  Configure mock Telefónica Open Gateway responses for testing.
                </p>
              </div>

              <div>
                <h4 style={sectionTitleStyle}>Number Verification</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Claimed Phone</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={mockContext.claimed_phone}
                      onChange={(e) => updateMockContext({ claimed_phone: e.target.value })}
                      placeholder="+34600000003"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Network Phone (simulated)</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={mockContext.network_phone}
                      onChange={(e) => updateMockContext({ network_phone: e.target.value })}
                      placeholder="+34600000003"
                    />
                  </div>
                  <div style={{
                    fontSize: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-1)',
                    backgroundColor: mockContext.claimed_phone === mockContext.network_phone 
                      ? 'rgba(22, 163, 74, 0.15)' 
                      : 'rgba(239, 68, 68, 0.15)',
                    color: mockContext.claimed_phone === mockContext.network_phone 
                      ? '#4ade80' 
                      : '#f87171',
                  }}>
                    {mockContext.claimed_phone === mockContext.network_phone ? '✓ Numbers match' : '✗ Numbers mismatch - will DENY'}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={sectionTitleStyle}>Location Verification</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Network Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      style={inputStyle}
                      value={mockContext.network_lat}
                      onChange={(e) => updateMockContext({ network_lat: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Network Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      style={inputStyle}
                      value={mockContext.network_lon}
                      onChange={(e) => updateMockContext({ network_lon: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--fg-1)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    Main Warehouse: 40.4168, -3.7038 (r=200m)<br/>
                    Field Office: 40.4500, -3.6800 (r=150m)
                  </div>
                </div>
              </div>

              <div>
                <h4 style={sectionTitleStyle}>Risk Signals</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      checked={mockContext.sim_swap_recent}
                      onChange={(e) => updateMockContext({ sim_swap_recent: e.target.checked })}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: 'var(--accent)',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--fg-0)' }}>Recent SIM Swap</span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      checked={mockContext.device_swap_recent}
                      onChange={(e) => updateMockContext({ device_swap_recent: e.target.checked })}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: 'var(--accent)',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--fg-0)' }}>Recent Device Swap</span>
                  </label>
                  {(mockContext.sim_swap_recent || mockContext.device_swap_recent) && (
                    <div style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-1)',
                      backgroundColor: 'rgba(202, 138, 4, 0.15)',
                      color: '#fbbf24',
                    }}>
                      ⚠ Risk signals may trigger STEP_UP for sensitive assets
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
              }}>
                <button
                  onClick={resetMockContext}
                  onMouseEnter={() => setResetHovered(true)}
                  onMouseLeave={() => setResetHovered(false)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: resetHovered ? 'var(--bg-0)' : 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-1)',
                    color: 'var(--fg-0)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Reset to Defaults
                </button>
              </div>

              <div style={{
                fontSize: '12px',
                color: 'var(--fg-1)',
              }}>
                <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--fg-0)' }}>Presets:</p>
                <button
                  onClick={() => updateMockContext({
                    claimed_phone: '+34600000003',
                    network_phone: '+34600000003',
                    network_lat: 40.4168,
                    network_lon: -3.7038,
                    sim_swap_recent: false,
                    device_swap_recent: false
                  })}
                  style={presetButtonStyle}
                >
                  → Inside Main Warehouse (all OK)
                </button>
                <button
                  onClick={() => updateMockContext({
                    claimed_phone: '+34600000003',
                    network_phone: '+34600000003',
                    network_lat: 40.5000,
                    network_lon: -3.7000,
                    sim_swap_recent: false,
                    device_swap_recent: false
                  })}
                  style={presetButtonStyle}
                >
                  → Outside geofence
                </button>
                <button
                  onClick={() => updateMockContext({
                    claimed_phone: '+34600000003',
                    network_phone: '+34999999999',
                    network_lat: 40.4168,
                    network_lon: -3.7038,
                    sim_swap_recent: false,
                    device_swap_recent: false
                  })}
                  style={presetButtonStyle}
                >
                  → Phone mismatch
                </button>
                <button
                  onClick={() => updateMockContext({
                    claimed_phone: '+34600000003',
                    network_phone: '+34600000003',
                    network_lat: 40.4168,
                    network_lon: -3.7038,
                    sim_swap_recent: true,
                    device_swap_recent: false
                  })}
                  style={presetButtonStyle}
                >
                  → SIM swap detected
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
