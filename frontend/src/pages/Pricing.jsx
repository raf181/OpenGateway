/**
 * Pricing Page
 */
import { IndexRailHero } from '../components/sections/IndexRailHero';
import { Navigation } from '../components/base/Navigation';
import { Footer } from '../components/base/Footer';
import { Button } from '../components/base/Button';
import { Badge } from '../components/base/Badge';
import { TabLabel } from '../components/base/TabLabel';

export function Pricing() {
  const plans = [
    {
      index: '01',
      name: 'Startup',
      price: '$299',
      period: 'month',
      description: 'Perfect for teams getting started.',
      recommended: false,
      features: [
        'Up to 5 team members',
        '100K events/day',
        'Basic detection',
        'Email support',
        '30-day data retention',
      ],
    },
    {
      index: '02',
      name: 'Professional',
      price: '$1,499',
      period: 'month',
      description: 'Advanced security for growing teams.',
      recommended: true,
      features: [
        'Up to 20 team members',
        'Unlimited events',
        'AI detection engine',
        'Custom playbooks',
        '1-year data retention',
        '24/7 phone support',
      ],
    },
    {
      index: '03',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact',
      description: 'Dedicated infrastructure & support.',
      recommended: false,
      features: [
        'Unlimited team members',
        'Unlimited events',
        'On-prem or hybrid deployment',
        'Custom integrations',
        'Unlimited data retention',
        'Dedicated support team',
      ],
    },
  ];

  return (
    <>
      <Navigation />

      {/* ──── HERO ──── */}
      <IndexRailHero
        index="03"
        headline="Pricing Built for Every Scale"
        subheadline="From startups to enterprises. Pay for what you use, scale as you grow."
      />

      {/* ──── PRICING CARDS (Editorial Grid) ──── */}
      <section className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6">
            {plans.map((plan) => (
              <div key={plan.index} className="relative group">
                {plan.recommended && (
                  <Badge variant="accent" className="absolute -top-3 left-space-6 z-10">
                    Recommended
                  </Badge>
                )}
                <TabLabel index={plan.index} />
                <div
                  className={`
                    relative rounded-xs border transition-all duration-140
                    ${
                      plan.recommended
                        ? 'border-[var(--accent)] bg-[var(--bg-1)] shadow-lg'
                        : 'border-[var(--border)] bg-[var(--bg-1)] shadow-xs hover:shadow-lg'
                    }
                    p-space-6 pt-space-8
                  `}
                >
                  <h3 className="font-display text-2xl font-600 mb-space-2 text-[var(--fg-0)]">
                    {plan.name}
                  </h3>
                  <p className="text-small text-[var(--fg-1)] mb-space-6">{plan.description}</p>

                  {/* Pricing */}
                  <div className="mb-space-6 pb-space-6 border-b border-[var(--border)]">
                    <div className="flex items-baseline gap-space-2">
                      <span className="font-display text-5xl font-700 text-[var(--fg-0)]">
                        {plan.price}
                      </span>
                      <span className="text-mono text-[var(--fg-1)] text-xs">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-space-3 mb-space-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-space-3">
                        <span className="text-[var(--accent)] mt-space-1">✓</span>
                        <span className="text-small text-[var(--fg-0)]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant={plan.recommended ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── COMPARISON TABLE ──── */}
      <section className="bg-[var(--bg-1)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <h2 className="font-display text-4xl font-700 text-[var(--fg-0)] mb-space-8">
            Plan Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-space-4 px-space-4 font-600 text-[var(--fg-0)] bg-[var(--bg-0)] sticky left-0 z-10 min-w-48">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.index}
                      className="text-center py-space-4 px-space-4 font-600 text-[var(--fg-0)]"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Team Members', startup: '5', pro: '20', enterprise: 'Unlimited' },
                  { name: 'Events/Day', startup: '100K', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { name: 'Data Retention', startup: '30 days', pro: '1 year', enterprise: 'Unlimited' },
                  { name: 'AI Detection', startup: '❌', pro: '✓', enterprise: '✓' },
                  { name: 'Custom Playbooks', startup: '❌', pro: '✓', enterprise: '✓' },
                  { name: 'API Access', startup: 'Limited', pro: 'Full', enterprise: 'Full' },
                  { name: 'Support', startup: 'Email', pro: '24/7 Phone', enterprise: 'Dedicated' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--bg-0)] transition-colors duration-140">
                    <td className="py-space-4 px-space-4 font-600 text-[var(--fg-0)] bg-[var(--bg-0)] sticky left-0 z-10">
                      {row.name}
                    </td>
                    <td className="text-center py-space-4 px-space-4 text-[var(--fg-0)]">
                      {row.startup}
                    </td>
                    <td className="text-center py-space-4 px-space-4 text-[var(--fg-0)]">
                      {row.pro}
                    </td>
                    <td className="text-center py-space-4 px-space-4 text-[var(--fg-0)]">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ──── FAQ ──── */}
      <section className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <h2 className="font-display text-4xl font-700 text-[var(--fg-0)] mb-space-8">
            Frequently Asked
          </h2>

          <div className="space-y-space-6">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes. Upgrade or downgrade anytime. Changes take effect at the next billing cycle.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes. Start with 30 days free. No credit card required to begin.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, wire transfers, and ACH for Enterprise plans.',
              },
              {
                q: 'Do you offer annual discounts?',
                a: 'Yes. Annual plans receive 20% off the monthly rate.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xs border border-[var(--border)] bg-[var(--bg-1)] p-space-6 cursor-pointer"
              >
                <summary className="flex items-baseline justify-between font-600 text-[var(--fg-0)] outline-none">
                  {item.q}
                  <span className="transition-transform duration-140 group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-space-4 text-small text-[var(--fg-1)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
