/**
 * Home Page - Index-Tab Editorial Futurism
 * Combines all 3 signature layout moments
 */
import { IndexRailHero } from '../components/sections/IndexRailHero';
import { AnchorBlockTabStack } from '../components/sections/AnchorBlockTabStack';
import { PinnedCopyLedgerVisuals } from '../components/sections/PinnedCopyLedgerVisuals';
import { Navigation } from '../components/base/Navigation';
import { Footer } from '../components/base/Footer';
import { Button } from '../components/base/Button';
import { Badge } from '../components/base/Badge';

export function Home() {
  return (
    <>
      <Navigation />

      {/* ──── SIGNATURE MOMENT #1: INDEX-RAIL HERO ──── */}
      <IndexRailHero
        index="01"
        headline="Enterprise Network Security, Redefined"
        subheadline="OpenGateway: Real-time monitoring, instant threat response, and unified infrastructure control."
        ctas={[
          { label: 'Start Free Trial', href: '#', variant: 'primary' },
          { label: 'View Demo', href: '#', variant: 'secondary' },
        ]}
      />

      {/* ──── SOCIAL PROOF STRIP ──── */}
      <section style={{
        backgroundColor: 'var(--bg-1)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-6)',
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-1)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-4)',
          }}>TRUSTED BY</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            alignItems: 'center',
          }}>
            {['TechCorp', 'SecureNet', 'DataFlow', 'CloudVault', 'NetScan'].map((name) => (
              <span key={name} style={{
                fontSize: '13px',
                color: 'var(--fg-0)',
                fontWeight: 600,
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ──── SIGNATURE MOMENT #2: ANCHOR BLOCK + TAB STACK ──── */}
      <AnchorBlockTabStack
        anchor={{
          index: '02',
          title: 'Real-Time Threat Detection',
          description: 'Our AI-powered engine detects and neutralizes threats in milliseconds, not minutes. Integrated dashboards give you complete visibility into network behavior patterns.',
          cta: { label: 'Learn More', href: '#' },
        }}
        tabs={[
          {
            title: 'Live Monitoring',
            description: 'Monitor all network endpoints in real-time with sub-second latency.',
          },
          {
            title: 'Automated Response',
            description: 'Trigger custom playbooks to isolate threats before they spread.',
          },
          {
            title: 'Compliance Ready',
            description: 'Built-in audit trails and compliance reports for regulatory frameworks.',
          },
        ]}
      />

      {/* ──── SIGNATURE MOMENT #3: PINNED COPY + LEDGER VISUALS ──── */}
      <PinnedCopyLedgerVisuals
        chapters={[
          {
            title: 'Deploy in Minutes',
            description: 'No infrastructure changes needed. Connect to your existing network and OpenGateway does the rest.',
          },
          {
            title: 'Unified Control Panel',
            description: 'Single pane of glass for all security policies, incidents, and compliance reporting.',
          },
          {
            title: 'AI-Powered Insights',
            description: 'Machine learning models identify threats and suggest remediation in real-time.',
          },
        ]}
        visuals={[
          {
            label: 'DEPLOYMENT',
            time: '1-5 min',
            type: 'image',
            src: 'https://via.placeholder.com/600x400?text=Deployment+Dashboard',
            annotation: 'Zero-touch installation. Credentials managed securely.',
          },
          {
            label: 'MONITORING',
            time: 'Real-time',
            type: 'image',
            src: 'https://via.placeholder.com/600x400?text=Live+Monitoring',
            annotation: 'Sub-second updates. Historical data retention up to 1 year.',
          },
          {
            label: 'RESPONSE',
            time: '<100ms',
            type: 'image',
            src: 'https://via.placeholder.com/600x400?text=Threat+Response',
            annotation: 'Automated or manual playbook triggers available.',
          },
        ]}
      />

      {/* ──── FEATURES GRID ──── */}
      <section style={{
        backgroundColor: 'var(--bg-0)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-9) var(--space-6)',
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}>
          <div style={{
            marginBottom: 'var(--space-8)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--fg-0)',
              marginBottom: 'var(--space-3)',
              margin: 0,
            }}>
              Enterprise Features
            </h2>
            <p style={{
              color: 'var(--fg-1)',
              maxWidth: '36ch',
              marginTop: 'var(--space-3)',
            }}>
              Built for teams that demand precision, speed, and reliability.
            </p>
          </div>

          {/* Feature cards (3 col grid) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {[
              { title: 'Multi-Tenant Architecture', desc: 'Isolated environments for secure team collaboration.' },
              { title: 'API-First Design', desc: 'Integrate with your stack via comprehensive REST/gRPC APIs.' },
              { title: '99.99% Uptime SLA', desc: 'Enterprise-grade redundancy across regions.' },
              { title: 'End-to-End Encryption', desc: 'Zero-knowledge architecture. Only you own your data.' },
              { title: 'Custom Playbooks', desc: 'Define response rules in plain language or YAML.' },
              { title: '24/7 Premium Support', desc: 'Dedicated support team with <15min response time.' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-1)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-1)',
                  padding: 'var(--space-6)',
                  boxShadow: 'var(--shadow-1)',
                  transition: 'all var(--dur-2) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-1)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: 'var(--space-6)',
                    padding: `var(--space-1) var(--space-3)`,
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-0)',
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  0{i + 1}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginTop: 'var(--space-6)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--fg-0)',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--fg-1)',
                  margin: 0,
                }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA SECTION ──── */}
      <section style={{
        backgroundColor: 'var(--bg-1)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-9) var(--space-6)',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--fg-0)',
            marginBottom: 'var(--space-5)',
            margin: 0,
          }}>
            Ready to Secure Your Network?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--fg-1)',
            marginBottom: 'var(--space-8)',
            maxWidth: '48ch',
            margin: 'var(--space-5) auto var(--space-8)',
          }}>
            Join thousands of enterprise teams protecting their infrastructure with OpenGateway.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            marginBottom: 'var(--space-6)',
          }}>
            <Button variant="primary">Get Started Free</Button>
            <Button variant="secondary">Schedule a Demo</Button>
          </div>
          <p style={{
            fontSize: '13px',
            color: 'var(--fg-1)',
            margin: 0,
          }}>
            No credit card required. 30-day free trial.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
