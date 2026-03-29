import { render, screen } from '@testing-library/react';
import { NoteItem } from './NoteItem';
import { Note } from '../types/note';

const baseNote: Note = {
  id: '1',
  title: '테스트 노트',
  content: '테스트 내용',
  tags: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('NoteItem', () => {
  const defaultProps = {
    note: baseNote,
    isSelected: false,
    onSelect: vi.fn(),
    onDelete: vi.fn(),
  };

  describe('정상', () => {
    it('should display tag badges when note has tags', () => {
      const note = { ...baseNote, tags: ['react'] };
      render(<NoteItem {...defaultProps} note={note} />);

      expect(screen.getByText('react')).toBeInTheDocument();
    });

    it('should display multiple tag badges when note has multiple tags', () => {
      const note = { ...baseNote, tags: ['react', 'typescript', 'vite'] };
      render(<NoteItem {...defaultProps} note={note} />);

      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
      expect(screen.getByText('vite')).toBeInTheDocument();
    });
  });

  describe('경계', () => {
    it('should display 5 tag badges when note has maximum tags', () => {
      const note = {
        ...baseNote,
        tags: ['react', 'typescript', 'vite', 'tailwind', 'vitest'],
      };
      render(<NoteItem {...defaultProps} note={note} />);

      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
      expect(screen.getByText('vite')).toBeInTheDocument();
      expect(screen.getByText('tailwind')).toBeInTheDocument();
      expect(screen.getByText('vitest')).toBeInTheDocument();
    });
  });

  describe('예외', () => {
    it('should not render tag area when note has no tags', () => {
      const { container, unmount } = render(
        <NoteItem {...defaultProps} note={{ ...baseNote, tags: ['react'] }} />,
      );
      // 태그가 있는 노트에서는 tag-badges가 존재해야 함
      expect(container.querySelector('[data-testid="tag-badges"]')).toBeInTheDocument();
      unmount();

      // 태그가 없는 노트에서는 tag-badges가 없어야 함
      const { container: emptyContainer } = render(
        <NoteItem {...defaultProps} note={{ ...baseNote, tags: [] }} />,
      );
      expect(emptyContainer.querySelector('[data-testid="tag-badges"]')).not.toBeInTheDocument();
    });

    it('should wrap tag badges to next line when tags overflow card width', () => {
      const note = {
        ...baseNote,
        tags: ['react', 'typescript', 'vite', 'tailwind', 'vitest'],
      };
      const { container } = render(<NoteItem {...defaultProps} note={note} />);

      const tagArea = container.querySelector('[data-testid="tag-badges"]');
      expect(tagArea).toBeInTheDocument();
      expect(tagArea).toHaveClass('flex-wrap');
    });
  });
});
