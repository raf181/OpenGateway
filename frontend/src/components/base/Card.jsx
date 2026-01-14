/**
 * Card - Featured card with tab label and crop marks
 */
import { TabLabel } from './TabLabel';
import { CropMarksContainer } from './CropMarks';

export function Card({
  index,
  label,
  title,
  children,
  featured = false,
  className = '',
}) {
  const baseClasses = `
    relative rounded-xs border border-[var(--border)]
    bg-[var(--bg-1)] shadow-xs
    transition-all duration-140 ease-out
    hover:border-opacity-100 hover:shadow-lg
    p-space-6
  `;

  const content = (
    <div className={baseClasses}>
      {featured && <CropMarksContainer size={20} />}
      {(index || label) && <TabLabel index={index} label={label} />}
      {title && <h3 className="font-display text-xl font-600 mt-space-8 mb-space-4">{title}</h3>}
      {children}
    </div>
  );

  return featured ? (
    <CropMarksContainer>
      {content}
    </CropMarksContainer>
  ) : (
    content
  );
}
