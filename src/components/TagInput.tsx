import { useState } from 'react';
import toast from 'react-hot-toast';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    const value = inputValue.trim();

    if (!value) {
      handleCancel();
      return;
    }

    if (editingIndex !== null) {
      const isDuplicate = tags.some((t, i) => i !== editingIndex && t === value);
      if (isDuplicate) {
        toast.error('이미 존재하는 태그입니다.');
        return;
      }
      onChange(tags.map((t, i) => (i === editingIndex ? value : t)));
      setEditingIndex(null);
    } else {
      if (tags.includes(value)) {
        toast.error('이미 존재하는 태그입니다.');
        return;
      }
      onChange([...tags, value]);
      setIsAdding(false);
    }
    setInputValue('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
    if (e.key === 'Escape') handleCancel();
  };

  const handleTagClick = (index: number) => {
    setEditingIndex(index);
    setInputValue(tags[index]);
    setIsAdding(false);
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (editingIndex === index) {
      setEditingIndex(null);
      setInputValue('');
    }
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {tags.map((tag, index) =>
        editingIndex === index ? (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/10 border border-foreground/30"
          >
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleConfirm}
              className="w-16 text-xs bg-transparent outline-none text-foreground"
            />
          </span>
        ) : (
          <span
            key={index}
            onClick={() => handleTagClick(index)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/10 text-xs text-foreground cursor-pointer hover:bg-foreground/15 transition-colors"
          >
            {tag}
            <button
              onClick={(e) => handleDelete(e, index)}
              className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer leading-none"
            >
              ×
            </button>
          </span>
        ),
      )}

      {isAdding ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-foreground/10 border border-foreground/30">
          <input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleConfirm}
            placeholder="태그 입력"
            className="w-16 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
          />
        </span>
      ) : (
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingIndex(null);
            setInputValue('');
          }}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-foreground/10 text-muted-foreground hover:bg-foreground/15 transition-colors text-xs cursor-pointer"
        >
          +
        </button>
      )}
    </div>
  );
}
