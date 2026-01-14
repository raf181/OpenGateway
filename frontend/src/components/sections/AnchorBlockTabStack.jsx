/**
 * Signature Layout #2: Anchor Block + Tab Stack
 * Left: Large featured card (7 cols) with tab + crop marks
 * Right: Stack of 3 tabbed mini-blocks (5 cols)
 */
import { TabLabel } from '../base/TabLabel';
import { CropMarksContainer } from '../base/CropMarks';

export function AnchorBlockTabStack({
  anchor = {},
  tabs = [],
}) {
  return (
    <section className="bg-[var(--bg-0)] border-b border-[var(--border)] py-space-9 px-space-6">
      <div className="max-w-editorial mx-auto">
        <div className="grid grid-cols-12 gap-space-6">
          {/* Left: Anchor Block (7 cols) */}
          <div className="col-span-12 lg:col-span-7">
            <CropMarksContainer size={20}>
              <div className="relative rounded-xs border border-[var(--border)] bg-[var(--bg-1)] p-space-6 shadow-xs transition-all duration-140 hover:shadow-lg">
                <TabLabel index={anchor.index || '01'} />
                {anchor.image && (
                  <img
                    src={anchor.image}
                    alt={anchor.title}
                    className="w-full h-96 object-cover rounded-xs mb-space-6"
                  />
                )}
                <h3 className="font-display text-2xl font-600 mb-space-4 text-[var(--fg-0)]">
                  {anchor.title}
                </h3>
                <p className="text-[var(--fg-1)] mb-space-6">{anchor.description}</p>
                {anchor.cta && (
                  <a
                    href={anchor.cta.href}
                    className="inline-block px-space-5 py-space-3 bg-[var(--accent)] text-[var(--bg-0)] rounded-xs font-mono text-sm font-600 transition-all duration-140 hover:-translate-y-[1px]"
                  >
                    {anchor.cta.label}
                  </a>
                )}
              </div>
            </CropMarksContainer>
          </div>

          {/* Right: Tab Stack (5 cols) */}
          <div className="col-span-12 lg:col-span-5 space-y-space-6">
            {tabs.map((tab, i) => (
              <div key={i} className="group relative">
                <TabLabel index={i + 2} />
                <div className="rounded-xs border border-[var(--border)] bg-[var(--bg-1)] p-space-5 shadow-xs transition-all duration-140 group-hover:shadow-lg group-hover:border-opacity-100">
                  <h4 className="font-display text-lg font-600 mb-space-3 text-[var(--fg-0)]">
                    {tab.title}
                  </h4>
                  <p className="text-small text-[var(--fg-1)]">{tab.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
