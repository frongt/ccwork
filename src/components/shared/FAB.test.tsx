import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAB } from './FAB';

describe('FAB', () => {
  describe('기본 렌더링', () => {
    it('button 엘리먼트를 렌더링한다', () => {
      render(<FAB onClick={vi.fn()} aria-label="추가" icon={<span />} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('icon을 표시한다', () => {
      render(<FAB onClick={vi.fn()} aria-label="추가" icon={<span>+</span>} />);
      expect(screen.getByText('+')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('aria-label prop이 버튼에 설정된다', () => {
      render(<FAB onClick={vi.fn()} aria-label="새 노트 추가" icon={<span />} />);
      expect(screen.getByRole('button', { name: '새 노트 추가' })).toBeInTheDocument();
    });
  });

  describe('이벤트', () => {
    it('클릭 시 onClick 핸들러가 호출된다', async () => {
      const onClick = vi.fn();
      render(<FAB onClick={onClick} aria-label="추가" icon={<span />} />);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
