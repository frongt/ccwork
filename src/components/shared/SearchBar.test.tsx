import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  describe('기본 렌더링', () => {
    it('search 타입 input을 렌더링한다', () => {
      render(<SearchBar value="" onChange={vi.fn()} />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('기본 placeholder를 aria-label로 표시한다', () => {
      render(<SearchBar value="" onChange={vi.fn()} />);
      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'aria-label',
        'Search your thoughts...',
      );
    });
  });

  describe('value / onChange', () => {
    it('value prop이 input에 반영된다', () => {
      render(<SearchBar value="검색어" onChange={vi.fn()} />);
      expect(screen.getByRole('searchbox')).toHaveValue('검색어');
    });

    it('입력 시 onChange 핸들러가 새 값과 함께 호출된다', () => {
      const onChange = vi.fn();
      render(<SearchBar value="" onChange={onChange} />);
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: '검색어' } });
      expect(onChange).toHaveBeenCalledWith('검색어');
    });
  });

  describe('clear 버튼', () => {
    it('value가 있고 onClear가 있을 때 clear 버튼이 표시된다', () => {
      render(<SearchBar value="검색어" onChange={vi.fn()} onClear={vi.fn()} />);
      expect(screen.getByRole('button', { name: '검색 초기화' })).toBeInTheDocument();
    });

    it('value가 빈 문자열이면 clear 버튼이 표시되지 않는다', () => {
      render(<SearchBar value="" onChange={vi.fn()} onClear={vi.fn()} />);
      expect(screen.queryByRole('button', { name: '검색 초기화' })).not.toBeInTheDocument();
    });

    it('onClear가 없으면 value가 있어도 clear 버튼이 표시되지 않는다', () => {
      render(<SearchBar value="검색어" onChange={vi.fn()} />);
      expect(screen.queryByRole('button', { name: '검색 초기화' })).not.toBeInTheDocument();
    });

    it('clear 버튼의 aria-label이 "검색 초기화"이다', () => {
      render(<SearchBar value="검색어" onChange={vi.fn()} onClear={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', '검색 초기화');
    });

    it('clear 버튼 클릭 시 onClear 핸들러가 호출된다', async () => {
      const onClear = vi.fn();
      render(<SearchBar value="검색어" onChange={vi.fn()} onClear={onClear} />);
      await userEvent.click(screen.getByRole('button', { name: '검색 초기화' }));
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('접근성', () => {
    it('input의 aria-label이 placeholder와 동일하다', () => {
      render(<SearchBar value="" onChange={vi.fn()} placeholder="메모 검색" />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', '메모 검색');
    });
  });
});
