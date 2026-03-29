import { useState } from 'react';
import { validateTag, getTagError, MAX_TAG_COUNT } from '../utils/tagValidation';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const isMaxed = tags.length >= MAX_TAG_COUNT;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    e.stopPropagation();
    setError('');

    const trimmed = input.trim();
    if (!trimmed) return;

    const { valid, normalized } = validateTag(trimmed);

    if (!valid) {
      setError(getTagError(trimmed));
      setInput('');
      return;
    }

    if (tags.includes(normalized)) {
      setError('이미 존재하는 태그입니다');
      setInput('');
      return;
    }

    onChange([...tags, normalized]);
    setInput('');
  };

  const handleRemove = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-muted text-foreground px-3 py-1 rounded-xl text-sm"
        >
          {tag}
          <button
            onClick={() => handleRemove(i)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isMaxed}
        placeholder="태그 입력"
      />
      {isMaxed && <p>최대 {MAX_TAG_COUNT}개까지 추가할 수 있습니다</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
