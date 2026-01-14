/**
 * About Page
 */
import { IndexRailHero } from '../components/sections/IndexRailHero';
import { Navigation } from '../components/base/Navigation';
import { Footer } from '../components/base/Footer';
import { TabLabel } from '../components/base/TabLabel';
import { CropMarksContainer } from '../components/base/CropMarks';

export function About() {
  const team = [
    { name: 'Alex Chen', title: 'Co-founder & CEO', index: '01' },
    { name: 'Jordan Lee', title: 'Co-founder & CTO', index: '02' },
    { name: 'Morgan White', title: 'VP Security', index: '03' },
    { name: 'Casey Roberts', title: 'Head of Product', index: '04' },
  ];

  const values = [
    {
      index: '01',
      title: 'Security First',
      description: 'Zero-compromise approach to data protection. Every feature is security-hardened from day one.',
    },
    {
      index: '02',
      title: 'Transparency',
      description: 'Open audit logs, full API documentation, and public security roadmap.',
    },
    {
      index: '03',
      title: 'Performance',
      description: 'Real-time threat detection at scale. Optimized for every infrastructure size.',
    },
  ];

  return (
    <>
      <Navigation />

      {/* ──── HERO ──── */}
      <IndexRailHero
        index="04"
        headline="Building Security Infrastructure"
        subheadline="OpenGateway was founded to bring enterprise-grade threat detection to every team."
      />

      {/* ──── STORY (3 Chapters) ──── */}
      <section className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <div className="space-y-space-9">
            {[
              {
                index: '01',
                title: 'The Problem',
                text: 'Enterprise security tools were built for the cloud era, but most teams still operate hybrid infrastructure. Legacy solutions require months to deploy and cost millions. We knew there had to be a better way.',
              },
              {
                index: '02',
                title: 'The Solution',
                text: 'We built OpenGateway from scratch with a single principle: deploy in minutes, protect in real-time. API-first design means you control everything. No vendor lock-in. No black boxes.',
              },
              {
                index: '03',
                title: 'The Impact',
                text: 'Today, thousands of teams use OpenGateway to protect billions of requests daily. From startups to Fortune 500s, our customers trust us with their most critical infrastructure.',
              },
            ].map((chapter) => (
              <div key={chapter.index} className="relative">
                <TabLabel index={chapter.index} />
                <div className="mt-space-8 pt-space-6 border-t border-[var(--border)]">
                  <h3 className="font-display text-2xl font-600 mb-space-4 text-[var(--fg-0)]">
                    {chapter.title}
                  </h3>
                  <p className="text-[var(--fg-1)] leading-relaxed max-w-96">
                    {chapter.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── VALUES STACK ──── */}
      <section className="bg-[var(--bg-1)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <h2 className="font-display text-4xl font-700 text-[var(--fg-0)] mb-space-8">
            Our Values
          </h2>
          <div className="space-y-space-6">
            {values.map((value) => (
              <div key={value.index} className="group relative">
                <TabLabel index={value.index} />
                <div className="rounded-xs border border-[var(--border)] bg-[var(--bg-0)] p-space-6 pt-space-8 transition-all duration-140 group-hover:shadow-lg">
                  <h3 className="font-display text-xl font-600 mb-space-3 text-[var(--fg-0)]">
                    {value.title}
                  </h3>
                  <p className="text-small text-[var(--fg-1)]">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TEAM ──── */}
      <section className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
        <div className="max-w-editorial mx-auto">
          <h2 className="font-display text-4xl font-700 text-[var(--fg-0)] mb-space-8">
            Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-6">
            {team.map((member) => (
              <div key={member.index} className="group relative">
                <TabLabel index={member.index} />
                <CropMarksContainer size={20}>
                  <div className="rounded-xs border border-[var(--border)] bg-[var(--bg-1)] p-space-6 pt-space-8 transition-all duration-140 group-hover:shadow-lg">
                    <h4 className="font-display text-lg font-600 text-[var(--fg-0)] mb-space-1">
                      {member.name}
                    </h4>
                    <p className="text-small text-[var(--accent)]">{member.title}</p>
                  </div>
                </CropMarksContainer>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
