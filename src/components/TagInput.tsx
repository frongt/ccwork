import type { ReactElement } from 'react';

interface TagInputProps {
  isOpen: boolean;
  value: string;
  onToggle: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void; // Enter 입력 시. 내부에서 preventDefault 후 호출한다
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TagInput(_props: TagInputProps): ReactElement {
  throw new Error('not implemented');
}
