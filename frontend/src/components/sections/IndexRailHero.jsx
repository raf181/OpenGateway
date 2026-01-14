/**
 * Signature Layout #1: Index-Rail Hero
 * Left: vertical meta rail
 * Right: aggressive headline with CTA cluster
 */

export function IndexRailHero({
  index = '01',
  headline,
  subheadline,
  ctas = [],
  children,
}) {
  return (
    <section className="min-h-[600px] bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
      <div className="max-w-editorial mx-auto">
        <div className="grid grid-cols-12 gap-space-6 items-start">
          {/* Left: Index Rail (2 cols) */}
          <div
            className="col-span-12 md:col-span-2 flex items-baseline gap-space-3 mb-space-8 md:mb-0"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            }}
          >
            <span className="text-mono text-[var(--accent)] font-600">[{index}]</span>
            <div className="h-px w-space-6 bg-[var(--border)]" />
          </div>

          {/* Right: Headline + CTA (10 cols) */}
          <div className="col-span-12 md:col-span-10">
            <h1 className="font-display text-5xl md:text-7xl font-700 leading-tight text-[var(--fg-0)] mb-space-6">
              {headline}
            </h1>
            {subheadline && (
              <p className="text-lg text-[var(--fg-1)] mb-space-8 max-w-72">{subheadline}</p>
            )}
            {ctas.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-space-4 mt-space-8">
                {ctas.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.href}
                    className={`
                      px-space-6 py-space-4 rounded-xs font-mono text-sm font-600
                      transition-all duration-140 ease-out
                      ${cta.variant === 'secondary'
                        ? 'bg-transparent border border-[var(--border)] text-[var(--fg-0)] hover:bg-[var(--bg-1)]'
                        : 'bg-[var(--accent)] text-[var(--bg-0)] hover:-translate-y-[1px]'
                      }
                    `}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
