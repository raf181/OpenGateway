import { useState, useEffect } from 'react';

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Sensitive Asset Checkout',
      description: 'Verification requirements for sensitive assets',
      enabled: true,
      checks: {
        number_verification: true,
        sim_swap_check: true,
        device_swap_check: true,
        location_verification: true,
      },
    },
    {
      id: 2,
      name: 'Standard Asset Checkout',
      description: 'Default verification for regular assets',
      enabled: true,
      checks: {
        number_verification: true,
        sim_swap_check: false,
        device_swap_check: false,
        location_verification: false,
      },
    },
    {
      id: 3,
      name: 'Off-Site Checkout',
      description: 'Policy for assets leaving the facility',
      enabled: false,
      checks: {
        number_verification: true,
        sim_swap_check: true,
        device_swap_check: true,
        location_verification: false,
      },
    },
  ]);

  const [expandedPolicy, setExpandedPolicy] = useState(null);

  const togglePolicy = (id) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const toggleCheck = (policyId, checkKey) => {
    setPolicies(policies.map(p => 
      p.id === policyId 
        ? { ...p, checks: { ...p.checks, [checkKey]: !p.checks[checkKey] } }
        : p
    ));
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    marginBottom: '16px',
  };

  const PhoneIcon = () => (
    <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
    </svg>
  );

  const LockIcon = () => (
    <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
    </svg>
  );

  const DeviceIcon = () => (
    <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
    </svg>
  );

  const LocationIcon = () => (
    <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
    </svg>
  );

  const checkLabels = {
    number_verification: {
      name: 'Number Verification',
      description: 'Verify user\'s phone number matches registration',
      icon: <PhoneIcon />,
    },
    sim_swap_check: {
      name: 'SIM Swap Detection',
      description: 'Check for recent SIM changes (fraud indicator)',
      icon: <LockIcon />,
    },
    device_swap_check: {
      name: 'Device Swap Detection',
      description: 'Check for recent device changes (security flag)',
      icon: <DeviceIcon />,
    },
    location_verification: {
      name: 'Location Verification',
      description: 'Confirm user is within site geofence',
      icon: <LocationIcon />,
    },
  };

  return (
    <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--bg-0)', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>Policy Configuration</h1>
        <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '4px' }}>Configure Open Gateway verification policies</p>
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: 'rgba(122, 226, 255, 0.1)',
        border: '1px solid rgba(122, 226, 255, 0.3)',
        borderRadius: 'var(--radius-2)',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
      }}>
        <svg style={{ width: 20, height: 20, color: 'var(--accent2)', flexShrink: 0, marginTop: '2px' }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <p style={{ color: 'var(--fg-0)', fontSize: '14px', margin: 0, fontWeight: 500 }}>Telefónica Open Gateway Integration</p>
          <p style={{ color: 'var(--fg-1)', fontSize: '13px', margin: '4px 0 0' }}>
            Policies define which Open Gateway API checks are performed during asset checkout.
            Each check adds a layer of verification to prevent unauthorized access.
          </p>
        </div>
      </div>

      {/* Policies */}
      {policies.map(policy => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          cardStyle={cardStyle}
          checkLabels={checkLabels}
          expanded={expandedPolicy === policy.id}
          onToggleExpand={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)}
          onTogglePolicy={() => togglePolicy(policy.id)}
          onToggleCheck={(checkKey) => toggleCheck(policy.id, checkKey)}
        />
      ))}

      {/* API Status */}
      <div style={{ ...cardStyle, padding: '20px', marginTop: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fg-0)', margin: 0, marginBottom: '16px' }}>API Endpoints</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(checkLabels).map(([key, check]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{check.icon}</span>
                <span style={{ color: 'var(--fg-0)', fontSize: '14px' }}>{check.name}</span>
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: 'rgba(22, 163, 74, 0.15)',
                color: '#4ade80',
              }}>
                Connected
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PolicyCard({ policy, cardStyle, checkLabels, expanded, onToggleExpand, onTogglePolicy, onToggleCheck }) {
  const [toggleHovered, setToggleHovered] = useState(false);

  return (
    <div style={cardStyle}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, cursor: 'pointer' }} onClick={onToggleExpand}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: policy.enabled ? '#4ade80' : 'rgba(107, 114, 128, 0.5)',
          }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fg-0)', margin: 0 }}>{policy.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--fg-1)', margin: '2px 0 0' }}>{policy.description}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Object.entries(policy.checks).filter(([, v]) => v).map(([key]) => (
              <span key={key} style={{ fontSize: '14px' }} title={checkLabels[key]?.name}>
                {checkLabels[key]?.icon}
              </span>
            ))}
          </div>

          <button
            onClick={onTogglePolicy}
            onMouseEnter={() => setToggleHovered(true)}
            onMouseLeave={() => setToggleHovered(false)}
            style={{
              padding: '6px 14px',
              backgroundColor: policy.enabled 
                ? (toggleHovered ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)')
                : (toggleHovered ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.1)'),
              border: 'none',
              borderRadius: 'var(--radius-1)',
              color: policy.enabled ? '#f87171' : '#4ade80',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {policy.enabled ? 'Disable' : 'Enable'}
          </button>

          <button
            onClick={onToggleExpand}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-1)',
              color: 'var(--fg-1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(180deg)' : 'none',
            }}
          >
            <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid var(--border)', 
          backgroundColor: 'var(--bg-0)',
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--fg-1)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Verification Checks
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {Object.entries(checkLabels).map(([key, check]) => (
              <CheckToggle
                key={key}
                checkKey={key}
                check={check}
                enabled={policy.checks[key]}
                onToggle={() => onToggleCheck(key)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckToggle({ check, enabled, onToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px',
        backgroundColor: hovered ? 'var(--bg-1)' : 'transparent',
        borderRadius: 'var(--radius-1)',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        backgroundColor: enabled ? 'var(--accent)' : 'transparent',
        border: enabled ? 'none' : '2px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px',
      }}>
        {enabled && (
          <svg style={{ width: 12, height: 12, color: '#0b0d10' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>{check.icon}</span>
          <span style={{ fontSize: '14px', color: 'var(--fg-0)', fontWeight: 500 }}>{check.name}</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--fg-1)', margin: '4px 0 0' }}>{check.description}</p>
      </div>
    </div>
  );
}
