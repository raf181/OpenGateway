/**
 * Features Page
 */
import { IndexRailHero } from '../components/sections/IndexRailHero';
import { PinnedCopyLedgerVisuals } from '../components/sections/PinnedCopyLedgerVisuals';
import { Navigation } from '../components/base/Navigation';
import { Footer } from '../components/base/Footer';
import { TabLabel } from '../components/base/TabLabel';

export function Features() {
  return (
    <>
      <Navigation />

      {/* ──── HERO ──── */}
      <IndexRailHero
        index="02"
        headline="Features Built for Security Teams"
        subheadline="Enterprise-grade detection, response, and compliance in one platform."
      />

      {/* ──── PINNED COPY + VISUALS (3 chapters) ──── */}
      <PinnedCopyLedgerVisuals
        chapters={[
          {
            title: 'Detection Engine',
            description: 'Our AI models process millions of events per second, identifying anomalies and zero-day threats with zero false positives.',
          },
          {
            title: 'Response Automation',
            description: 'Custom playbooks execute instantly on threat detection. Quarantine, isolate, or escalate—your rules, your speed.',
          },
          {
            title: 'Forensic Analysis',
            description: 'Complete packet capture and behavioral timeline for every incident. Built-in PCAP export for deep investigation.',
          },
        ]}
        visuals={[
          {
            label: 'AI DETECTION',
            time: 'Real-time',
            type: 'image',
            src: 'https://via.placeholder.com/600x400?text=Detection+Engine',
            annotation: 'Detects threats in <50ms. Zero configuration.',
          },
          {
            label: 'PLAYBOOKS',
            time: 'Instant',
            type: 'image',
            src: 'https://via.placeholder.com/600x400?text=Response+Playbooks',
            annotation: 'YAML or GUI-based configuration.',
          },
          {
            label: 'FORENSICS',
            time: '1-year',
            type: 'image',
            src: 'https://via.placeholder.com/600x400?text=Forensic+Analysis',
            annotation: 'Full data retention with export options.',
          },
        ]}
      />

      {/* ──── DETAILED FEATURES (Spec Sheet Style) ──── */}
      <section className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <h2 className="font-display text-4xl font-700 text-[var(--fg-0)] mb-space-8">
            Complete Feature List
          </h2>

          {/* Ledger-style table */}
          <div className="space-y-space-6">
            {[
              {
                category: 'Detection',
                features: [
                  { name: 'Machine Learning Detection', status: 'Included' },
                  { name: 'Pattern Recognition', status: 'Included' },
                  { name: 'Custom Rules Engine', status: 'Included' },
                ],
              },
              {
                category: 'Response',
                features: [
                  { name: 'Automated Playbooks', status: 'Included' },
                  { name: 'Manual Overrides', status: 'Included' },
                  { name: 'Third-party Integration', status: 'Included' },
                ],
              },
              {
                category: 'Compliance',
                features: [
                  { name: 'SOC 2 Type II', status: 'Certified' },
                  { name: 'HIPAA Compliance', status: 'Available' },
                  { name: 'PCI DSS 3.2.1', status: 'Available' },
                ],
              },
            ].map((section, i) => (
              <div key={i}>
                <div className="relative mb-space-6">
                  <TabLabel index={i + 1} label={section.category} />
                  <div className="flex items-baseline justify-between gap-space-4 pt-space-6 pb-space-3 border-b border-[var(--border)]">
                    <h3 className="font-display text-xl font-600 text-[var(--fg-0)]">
                      {section.category}
                    </h3>
                  </div>
                </div>
                <div className="space-y-space-3">
                  {section.features.map((feature, j) => (
                    <div
                      key={j}
                      className="flex items-baseline justify-between gap-space-4 py-space-3 px-space-4 rounded-xs hover:bg-[var(--bg-1)] transition-colors duration-140"
                    >
                      <span className="text-[var(--fg-0)]">{feature.name}</span>
                      <span className="text-mono text-accent text-xs font-600">
                        {feature.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
