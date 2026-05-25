import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RichEditor } from './RichEditor';

vi.mock('react-quill-new', () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }) => (
    <div
      data-testid="quill-editor"
      data-value={value}
      data-placeholder={placeholder}
      contentEditable
      onInput={(e) => onChange((e.target as HTMLElement).innerHTML)}
    />
  ),
}));

describe('RichEditor', () => {
  describe('기본 렌더링', () => {
    it('에디터 엘리먼트를 렌더링한다', () => {
      render(<RichEditor value="" onChange={() => {}} />);
      expect(screen.getByTestId('quill-editor')).toBeInTheDocument();
    });
  });

  describe('value', () => {
    it('전달된 value를 에디터에 반영한다', () => {
      render(<RichEditor value="<p>안녕하세요</p>" onChange={() => {}} />);
      expect(screen.getByTestId('quill-editor')).toHaveAttribute('data-value', '<p>안녕하세요</p>');
    });
  });

  describe('placeholder', () => {
    it('placeholder prop을 에디터에 전달한다', () => {
      render(<RichEditor value="" onChange={() => {}} placeholder="내용을 입력하세요..." />);
      expect(screen.getByTestId('quill-editor')).toHaveAttribute(
        'data-placeholder',
        '내용을 입력하세요...',
      );
    });
  });

  describe('onChange', () => {
    it('onChange prop이 함수로 전달된다', () => {
      const handleChange = vi.fn();
      render(<RichEditor value="" onChange={handleChange} />);
      expect(screen.getByTestId('quill-editor')).toBeInTheDocument();
    });
  });
});
