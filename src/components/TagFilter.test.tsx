import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilter } from './TagFilter';

describe('TagFilter', () => {
  const defaultProps = {
    allTags: ['react', 'typescript', 'vite'],
    selectedTags: [] as string[],
    onToggle: vi.fn(),
  };

  describe('정상', () => {
    it('모든 태그를 뱃지로 표시한다', () => {
      render(<TagFilter {...defaultProps} />);

      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
      expect(screen.getByText('vite')).toBeInTheDocument();
    });

    it('뱃지 클릭 시 해당 태그 이름으로 onToggle을 호출한다', () => {
      const onToggle = vi.fn();
      render(<TagFilter {...defaultProps} onToggle={onToggle} />);

      fireEvent.click(screen.getByText('react'));

      expect(onToggle).toHaveBeenCalledWith('react');
    });

    it('선택된 태그와 미선택 태그를 시각적으로 구분한다', () => {
      render(<TagFilter {...defaultProps} selectedTags={['react']} />);

      const selectedBadge = screen.getByText('react');
      const unselectedBadge = screen.getByText('typescript');

      expect(selectedBadge.className).not.toBe(unselectedBadge.className);
    });
  });

  describe('경계', () => {
    it('allTags가 빈 배열이면 렌더링하지 않는다', () => {
      const { container } = render(<TagFilter {...defaultProps} allTags={[]} />);

      expect(container.querySelector('[data-testid="tag-filter"]')).not.toBeInTheDocument();
    });
  });
});
