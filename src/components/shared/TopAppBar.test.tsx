import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopAppBar } from './TopAppBar';

describe('TopAppBar', () => {
  describe('기본 렌더링', () => {
    it('header 엘리먼트를 렌더링한다', () => {
      render(<TopAppBar title="제목" />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('title 텍스트를 표시한다', () => {
      render(<TopAppBar title="내 노트" />);
      expect(screen.getByText('내 노트')).toBeInTheDocument();
    });
  });

  describe('left', () => {
    it('left prop이 있을 때 왼쪽 영역을 렌더링한다', () => {
      render(<TopAppBar title="제목" left={<button>뒤로</button>} />);
      expect(screen.getByRole('button', { name: '뒤로' })).toBeInTheDocument();
    });

    it('left prop이 없을 때 왼쪽 영역을 렌더링하지 않는다', () => {
      render(<TopAppBar title="제목" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('right', () => {
    it('right prop이 있을 때 오른쪽 영역을 렌더링한다', () => {
      render(<TopAppBar title="제목" right={<button>더보기</button>} />);
      expect(screen.getByRole('button', { name: '더보기' })).toBeInTheDocument();
    });

    it('right prop이 없을 때 오른쪽 영역을 렌더링하지 않는다', () => {
      render(<TopAppBar title="제목" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
