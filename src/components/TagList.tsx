import type { ReactElement } from 'react';
import { Tag } from './Tag';

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps): ReactElement | null {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Tag key={`${tag}-${index}`} label={tag} />
      ))}
    </div>
  );
}
