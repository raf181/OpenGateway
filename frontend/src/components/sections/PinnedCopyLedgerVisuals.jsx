/**
 * Signature Layout #3: Pinned Copy with Ledger Visuals
 * Left: Pinned copy column (scrolls with a sticky pin point)
 * Right: Visuals that fade in/out as user scrolls
 */
import { useEffect, useState } from 'react';

export function PinnedCopyLedgerVisuals({
  chapters = [],
  visuals = [],
}) {
  const [activeVisual, setActiveVisual] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate which visual should be visible based on scroll
      const section = document.querySelector('[data-ledger-section]');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));

      setScrollProgress(progress);
      const visualIndex = Math.floor(progress * visuals.length);
      setActiveVisual(Math.min(visualIndex, visuals.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visuals.length]);

  return (
    <section
      className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6"
      data-ledger-section
    >
      <div className="max-w-editorial mx-auto">
        <div className="grid grid-cols-12 gap-space-8">
          {/* Left: Pinned Copy (5 cols) */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-24 lg:h-fit">
            <h2 className="font-display text-3xl font-700 mb-space-8 text-[var(--fg-0)]">
              How It Works
            </h2>
            <div className="space-y-space-8">
              {chapters.map((chapter, i) => (
                <div key={i} className="pb-space-6 border-b border-[var(--border)] border-opacity-30 last:border-b-0">
                  <p className="text-mono text-[var(--accent)] text-xs mb-space-2">
                    [{String(i + 1).padStart(2, '0')}]
                  </p>
                  <h3 className="font-display text-lg font-600 mb-space-3 text-[var(--fg-0)]">
                    {chapter.title}
                  </h3>
                  <p className="text-small text-[var(--fg-1)] leading-relaxed">
                    {chapter.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Ledger Visuals (7 cols) */}
          <div className="col-span-12 lg:col-span-7">
            <div className="space-y-space-9">
              {visuals.map((visual, i) => (
                <div
                  key={i}
                  className="transition-all duration-300 ease-inout"
                  style={{
                    opacity: activeVisual === i ? 1 : 0.3,
                    transform: activeVisual === i ? 'translateY(0)' : 'translateY(12px)',
                  }}
                >
                  {/* Ledger-style header */}
                  <div className="flex items-baseline justify-between gap-space-4 mb-space-4 pb-space-3 border-b border-[var(--border)]">
                    <span className="text-mono text-[var(--fg-1)] text-xs">{visual.label}</span>
                    <span className="text-mono text-[var(--fg-1)] text-xs">{visual.time}</span>
                  </div>

                  {/* Visual content */}
                  {visual.type === 'image' ? (
                    <img
                      src={visual.src}
                      alt={visual.label}
                      className="w-full rounded-xs border border-[var(--border)]"
                    />
                  ) : (
                    <div className="bg-[var(--bg-1)] rounded-xs border border-[var(--border)] p-space-6 min-h-96 flex items-center justify-center">
                      {visual.content}
                    </div>
                  )}

                  {/* Ledger annotation */}
                  {visual.annotation && (
                    <p className="text-mono text-xs text-[var(--fg-1)] mt-space-4">
                      {visual.annotation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
