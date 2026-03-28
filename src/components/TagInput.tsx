import { useState } from 'react';
import { validateTag } from '../utils/tagValidation';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const isMaxed = tags.length >= 5;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    e.stopPropagation();
    setError('');

    const trimmed = input.trim();
    if (!trimmed) return;

    const { valid, normalized } = validateTag(trimmed);

    if (!valid) {
      if (trimmed.length > 20) {
        setError('20자 이하로 입력해주세요');
      } else {
        setError('한글, 영문, 숫자만 입력할 수 있습니다');
      }
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
    <div>
      {tags.map((tag, i) => (
        <span key={tag}>
          {tag}
          <button onClick={() => handleRemove(i)}>×</button>
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
      {isMaxed && <p>최대 5개까지 추가할 수 있습니다</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
