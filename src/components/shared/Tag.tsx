import { clsx } from 'clsx';

export type TagColor = 'indigo' | 'pink' | 'rose';

interface TagProps {
  label: string;
  color?: TagColor;
  /** 에디터에서 X 버튼과 함께 표시되는 제거 가능한 태그 */
  onRemove?: () => void;
  className?: string;
}

export function Tag({ label, color = 'indigo', onRemove, className }: TagProps) {
  if (onRemove) {
    return (
      <span className={clsx('tag tag-editor', className)}>
        {label}
        <button
          type="button"
          onClick={onRemove}
          className="tag-delete-btn"
          aria-label={`${label} 태그 삭제`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10.5"
            height="10.5"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>
      </span>
    );
  }

  return (
    <span className={clsx('tag', `tag-${color}`, className)}>
      {label}
    </span>
  );
}
