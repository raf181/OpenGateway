import { useOutletContext } from 'react-router-dom';

const Icon = ({ type, size = 40, color = 'var(--accent)' }) => {
  const style = { width: size, height: size, color };
  switch (type) {
    case 'location':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4-4.667 6-8 6-11a6 6 0 10-12 0c0 3 2 6.333 6 11z" />
          <circle cx="12" cy="10" r="2.5" />
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
    case 'shield':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c6-2.5 8-6.5 8-11.5V6l-8-3-8 3v3.5C4 14.5 6 18.5 12 21z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4a2 2 0 012-2h2a2 2 0 012 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 13h6" />
        </svg>
      );
    case 'antenna':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="6" r="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v12m-4 0h8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 11c1.5-2 4-3 7-3s5.5 1 7 3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9c2-2.5 5.5-4 9-4s7 1.5 9 4" />
        </svg>
      );
    case 'lock':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="6" y="10" width="12" height="10" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7a3 3 0 016 0v3" />
        </svg>
      );
    case 'link':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l-2 2a3 3 0 104.243 4.243l2-2M14 10l2-2a3 3 0 10-4.243-4.243l-2 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 11l-2 2" />
        </svg>
      );
    case 'chart':
      return (
        <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13h3v6H5zM10.5 9H14v10h-3.5zM16 5h3v14h-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16" />
        </svg>
      );
    case 'check':
      return (
        <svg style={style} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.42L8.5 12.086l6.793-6.796a1 1 0 011.411 0z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Landing() {
  const { setDemoModalOpen, setPricingModalOpen } = useOutletContext();

  // Shared styles
  const container = { maxWidth: '1280px', margin: '0 auto', padding: '0 16px' };
  const sectionPy = { padding: '80px 16px' };
  const card = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    padding: '24px',
  };
  const btnPrimary = {
    padding: '12px 24px',
    backgroundColor: 'var(--accent)',
    color: 'var(--bg-0)',
    border: 'none',
    borderRadius: 'var(--radius-1)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-ui)',
  };
  const btnSecondary = {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: 'var(--fg-0)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-ui)',
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-0)' }}>
      {/* Hero Section */}
      <section style={{ ...sectionPy, padding: '80px 16px 80px' }}>
        <div style={{ ...container, maxWidth: '900px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 700,
            color: 'var(--fg-0)',
            lineHeight: 1.1,
            fontFamily: 'var(--font-display)',
          }}>
            Prove who handled an asset. Prove where it happened.
          </h1>
          <p style={{
            marginTop: '24px',
            fontSize: '20px',
            color: 'var(--fg-1)',
            lineHeight: 1.6,
            fontFamily: 'var(--font-ui)',
          }}>
            GeoCustody is an enterprise custody and inventory platform that authorizes asset actions using Telefónica Open Gateway network verification. Reduce losses, fix inventory accuracy, and stop "off-site" transactions.
          </p>
          <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setDemoModalOpen(true)} style={btnPrimary}>Book a demo</button>
            <button onClick={() => setPricingModalOpen(true)} style={btnSecondary}>Request pricing</button>
          </div>
          <p style={{ marginTop: '32px', fontSize: '14px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>
            Designed for warehouses, field teams, and regulated operations.
          </p>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section style={{ padding: '48px 16px', backgroundColor: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={container}>
          <p style={{ textAlign: 'center', color: 'var(--fg-1)', marginBottom: '32px', fontFamily: 'var(--font-ui)' }}>
            Trusted by teams that manage high-value equipment and regulated inventory.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '32px', opacity: 0.5 }}>
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((name, i) => (
              <div key={i} style={{
                width: '128px',
                height: '48px',
                backgroundColor: 'var(--bg-0)',
                borderRadius: 'var(--radius-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-1)',
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
              }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section style={sectionPy}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Chain-of-custody meets network-grade verification
            </h2>
            <p style={{ marginTop: '16px', fontSize: '18px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>
              GeoCustody turns asset handling into verified transactions. Every check-out, transfer, return, and inventory closure can require proof that the employee is on site and using the expected mobile identity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Verified on-site actions', icon: 'location', desc: 'Network-based location verification confirms physical presence at authorized sites.' },
              { title: 'Employee-to-number binding', icon: 'phone', desc: 'Bind employee sessions to verified mobile numbers for identity assurance.' },
              { title: 'Fraud-aware approvals', icon: 'shield', desc: 'Detect SIM swaps and device changes to prevent unauthorized access.' },
              { title: 'Immutable audit trail', icon: 'clipboard', desc: 'Tamper-evident logging of all custody events with hash-chain verification.' },
            ].map((feature, i) => (
              <div key={i} style={{ ...card, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon type={feature.icon} />
                </div>
                <h3 style={{ fontWeight: 600, color: 'var(--fg-0)', marginBottom: '8px', fontFamily: 'var(--font-ui)' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ ...sectionPy, backgroundColor: 'var(--bg-1)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Authorize actions in real time
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {[
              { step: '1', title: 'Scan the asset', desc: 'QR code or NFC tag identification' },
              { step: '2', title: 'Verify identity', desc: 'Number verification via Open Gateway' },
              { step: '3', title: 'Verify location', desc: 'Network-based geofence check' },
              { step: '4', title: 'Apply policy', desc: 'Evaluate rules and risk signals' },
              { step: '5', title: 'Record custody', desc: 'Immutable audit trail entry' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-0)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  margin: '0 auto 16px',
                  fontFamily: 'var(--font-display)',
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontWeight: 600, color: 'var(--fg-0)', marginBottom: '4px', fontFamily: 'var(--font-ui)' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            maxWidth: '640px',
            margin: '0 auto',
            backgroundColor: 'rgba(198, 255, 58, 0.1)',
            border: '1px solid rgba(198, 255, 58, 0.3)',
            borderRadius: 'var(--radius-2)',
            padding: '24px',
          }}>
            <p style={{ color: 'var(--accent)', textAlign: 'center', fontFamily: 'var(--font-ui)' }}>
              <strong>Not GPS. Not guesswork.</strong> Location checks are network-based to reduce spoofing. Telefónica Open Gateway provides carrier-grade verification that cannot be faked by apps.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section style={sectionPy}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Built for operational control
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { title: 'Inventory & Custody', items: ['Asset catalog with QR/NFC tagging', 'Full custody lifecycle tracking', 'Exception handling and alerts', 'Multi-site support'] },
              { title: 'Authorization & Policy', items: ['Role-based access control', 'Configurable geofences', 'Manager approval workflows', 'Sensitivity-based policy rules'] },
              { title: 'Audit & Reporting', items: ['Complete event timeline', 'Compliance reports', 'CSV export capability', 'Real-time alerts'] },
            ].map((section, i) => (
              <div key={i} style={card}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--fg-0)', marginBottom: '16px', fontFamily: 'var(--font-ui)' }}>{section.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {section.items.map((item, j) => (
                    <li key={j} style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" style={{ ...sectionPy, backgroundColor: 'var(--bg-1)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Where GeoCustody fits
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Warehouse Tools', desc: 'Track high-value tools and ensure they are checked out and returned on-site.' },
              { title: 'Field Service Kits', desc: 'Verify technicians have the right equipment when arriving at customer sites.' },
              { title: 'Datacenter Hardware', desc: 'Secure chain-of-custody for servers, drives, and networking equipment.' },
              { title: 'Medical Devices', desc: 'Comply with regulations requiring verified handling of medical equipment.' },
              { title: 'Construction Equipment', desc: 'Prevent off-site use of expensive machinery and tools.' },
              { title: 'Regulated Inventory', desc: 'Meet audit requirements for controlled substances and materials.' },
            ].map((useCase, i) => (
              <div key={i} style={{ ...card, backgroundColor: 'var(--bg-0)' }}>
                <h3 style={{ fontWeight: 600, color: 'var(--fg-0)', marginBottom: '8px', fontFamily: 'var(--font-ui)' }}>{useCase.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" style={sectionPy}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Integrations
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Telefónica Open Gateway', icon: 'antenna', desc: 'Number Verification, Device Location, SIM Swap, Device Swap' },
              { title: 'SSO Providers', icon: 'lock', desc: 'Azure AD, Okta, Google Workspace, Keycloak' },
              { title: 'Webhooks & API', icon: 'link', desc: 'REST API, Webhook notifications' },
              { title: 'Enterprise Systems', icon: 'chart', desc: 'ServiceNow, SAP, Intune (optional)' },
            ].map((item, i) => (
              <div key={i} style={{ ...card, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <Icon type={item.icon} size={32} />
                </div>
                <h3 style={{ fontWeight: 600, color: 'var(--fg-0)', fontFamily: 'var(--font-ui)' }}>{item.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--fg-1)', marginTop: '4px', fontFamily: 'var(--font-ui)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" style={{ ...sectionPy, backgroundColor: 'var(--bg-1)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Security and privacy by design
            </h2>
            <p style={{ marginTop: '16px', fontSize: '18px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>
              GeoCustody performs transaction-based verification. It does not run continuous tracking. You control retention and access to logs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--fg-0)', marginBottom: '16px', fontFamily: 'var(--font-ui)' }}>Security</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['End-to-end encryption', 'SOC 2 Type II compliant infrastructure', 'Role-based access control', 'Audit logging with tamper detection', 'Regular penetration testing'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>
                    <Icon type="check" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--fg-0)', marginBottom: '16px', fontFamily: 'var(--font-ui)' }}>Privacy</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['No continuous location tracking', 'Transaction-based verification only', 'Configurable data retention', 'GDPR compliant', 'Data processing agreements available'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>
                    <Icon type="check" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section style={sectionPy}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              See it in action
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { title: 'Asset Dashboard', desc: 'View all assets, their status, and current custody assignments.' },
              { title: 'Verification Flow', desc: 'Real-time feedback on number and location verification.' },
              { title: 'Manager Approvals', desc: 'Review and approve step-up requests from employees.' },
              { title: 'Audit Timeline', desc: 'Complete history of all custody events with verification details.' },
            ].map((item, i) => (
              <div key={i} style={card}>
                <div style={{
                  backgroundColor: 'var(--bg-0)',
                  borderRadius: 'var(--radius-1)',
                  height: '192px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>Screenshot placeholder</span>
                </div>
                <h3 style={{ fontWeight: 600, color: 'var(--fg-0)', fontFamily: 'var(--font-ui)' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ ...sectionPy, backgroundColor: 'var(--bg-1)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Pricing
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '1024px', margin: '0 auto' }}>
            {[
              { name: 'Starter', price: 'Contact us', features: ['Up to 100 assets', 'Up to 10 users', 'Basic reporting', 'Email support'] },
              { name: 'Business', price: 'Contact us', features: ['Up to 1,000 assets', 'Up to 50 users', 'Advanced reporting', 'SSO integration', 'Priority support'], popular: true },
              { name: 'Enterprise', price: 'Contact us', features: ['Unlimited assets', 'Unlimited users', 'Custom integrations', 'Dedicated support', 'SLA guarantees', 'On-premise option'] },
            ].map((tier, i) => (
              <div key={i} style={{
                ...card,
                backgroundColor: 'var(--bg-0)',
                border: tier.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
              }}>
                {tier.popular && (
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', fontFamily: 'var(--font-ui)' }}>MOST POPULAR</div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>{tier.name}</h3>
                <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', marginTop: '8px', fontFamily: 'var(--font-display)' }}>{tier.price}</p>
                <ul style={{ marginTop: '24px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tier.features.map((feature, j) => (
                    <li key={j} style={{ fontSize: '14px', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-ui)' }}>
                      <svg style={{ width: 16, height: 16, color: 'var(--accent)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setDemoModalOpen(true)} style={{ ...btnPrimary, width: '100%', padding: '10px' }}>Book a demo</button>
                  <button onClick={() => setPricingModalOpen(true)} style={{ ...btnSecondary, width: '100%', padding: '10px' }}>Request pricing</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={sectionPy}>
        <div style={{ ...container, maxWidth: '768px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--fg-0)', fontFamily: 'var(--font-display)' }}>
              Frequently asked questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { q: 'What is Telefónica Open Gateway?', a: 'Telefónica Open Gateway is a set of network APIs that provide carrier-grade verification services including number verification, device location verification, and fraud detection signals like SIM swap detection.' },
              { q: 'Does GeoCustody track employees continuously?', a: 'No. GeoCustody only verifies location at the moment of a custody transaction. There is no continuous tracking or location history stored.' },
              { q: 'What happens if verification fails?', a: 'Depending on your policy configuration, failed verification can result in denial, or a step-up approval request that requires manager authorization.' },
              { q: 'Can GeoCustody work offline?', a: 'Basic scanning works offline, but verification requires network connectivity as it uses Telefónica Open Gateway APIs.' },
              { q: 'Is the audit trail really tamper-proof?', a: 'The audit trail uses a hash chain where each event includes a hash of the previous event. Any modification would break the chain and be immediately detectable.' },
              { q: 'What mobile networks are supported?', a: 'GeoCustody uses Telefónica Open Gateway, which supports verification on Telefónica and partner networks. Coverage varies by region.' },
            ].map((item, i) => (
              <div key={i} style={card}>
                <h3 style={{ fontWeight: 600, color: 'var(--fg-0)', marginBottom: '8px', fontFamily: 'var(--font-ui)' }}>{item.q}</h3>
                <p style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-ui)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 16px', backgroundColor: 'var(--accent)' }}>
        <div style={{ ...container, maxWidth: '768px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--bg-0)', fontFamily: 'var(--font-display)' }}>
            Stop guessing. Start proving custody.
          </h2>
          <p style={{ marginTop: '16px', fontSize: '18px', color: 'rgba(11, 13, 16, 0.7)', fontFamily: 'var(--font-ui)' }}>
            GeoCustody makes asset handling verifiable with network-grade authorization.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setDemoModalOpen(true)} style={{ ...btnPrimary, backgroundColor: 'var(--bg-0)', color: 'var(--accent)' }}>Book a demo</button>
            <button onClick={() => setPricingModalOpen(true)} style={{ ...btnSecondary, borderColor: 'var(--bg-0)', color: 'var(--bg-0)' }}>Request pricing</button>
          </div>
          <p style={{ marginTop: '32px', fontSize: '14px', color: 'rgba(11, 13, 16, 0.6)', fontFamily: 'var(--font-ui)' }}>
            Built for enterprise security and operational reality.
          </p>
        </div>
      </section>
    </div>
  );
}
