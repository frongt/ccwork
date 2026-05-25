import { clsx } from 'clsx';

interface CardProps {
  /** true일 때 핀된 노트 스타일(인디고 배경)로 표시 */
  isAccent?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Render a stylable card container that supports accenting, selection, and optional click interaction.
 *
 * When `onClick` is provided the card is made keyboard-focusable and will invoke the handler when
 * activated via mouse click or by pressing Enter. The component reflects selection state via
 * `aria-selected`.
 *
 * @param isAccent - When true, apply the accent (pinned) visual style
 * @param isSelected - When true, mark the card as selected (also applied to `aria-selected`)
 * @param onClick - Optional click handler; when present the card becomes focusable and responds to Enter
 * @param className - Additional CSS classes to append to the card element
 * @returns The rendered card element
 */
export function Card({ isAccent, isSelected, onClick, className, children }: CardProps) {
  return (
    <div
      className={clsx(
        'note-card',
        isAccent && 'note-card-accent',
        isSelected && 'selected',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-selected={isSelected}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return <p className={clsx('note-card-title', className)}>{children}</p>;
}

interface CardPreviewProps {
  className?: string;
  children: React.ReactNode;
}

export function CardPreview({ className, children }: CardPreviewProps) {
  return <p className={clsx('note-card-preview', className)}>{children}</p>;
}

interface CardFooterProps {
  date?: string;
  tags?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function CardFooter({ date, tags, actions, className }: CardFooterProps) {
  return (
    <div className={clsx('note-card-footer', className)}>
      {tags && <div className="flex items-center gap-1 flex-wrap">{tags}</div>}
      <div className="flex items-center gap-2 ml-auto">
        {date && <span className="note-card-meta">{date}</span>}
        {actions}
      </div>
    </div>
  );
}
