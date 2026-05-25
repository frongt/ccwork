import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  describe('기본 렌더링', () => {
    it('label 텍스트를 표시한다', () => {
      render(<FilterChip label="전체" onClick={vi.fn()} />);
      expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();
    });
  });

  describe('isActive', () => {
    it('isActive=true일 때 aria-pressed="true" 속성을 갖는다', () => {
      render(<FilterChip label="전체" isActive onClick={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('isActive=false일 때 aria-pressed="false" 속성을 갖는다', () => {
      render(<FilterChip label="전체" isActive={false} onClick={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('이벤트', () => {
    it('클릭 시 onClick 핸들러가 호출된다', async () => {
      const onClick = vi.fn();
      render(<FilterChip label="전체" onClick={onClick} />);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('(class) 스타일', () => {
    it('filter-chip 클래스를 갖는다', () => {
      render(<FilterChip label="전체" onClick={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveClass('filter-chip');
    });

    it('isActive=true일 때 active 클래스를 갖는다', () => {
      render(<FilterChip label="전체" isActive onClick={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveClass('active');
    });

    it('isActive=false일 때 active 클래스가 없다', () => {
      render(<FilterChip label="전체" isActive={false} onClick={vi.fn()} />);
      expect(screen.getByRole('button')).not.toHaveClass('active');
    });
  });
});
