import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  describe('기본 렌더링', () => {
    it('title을 표시한다', () => {
      render(<EmptyState title="노트가 없습니다" />);
      expect(screen.getByText('노트가 없습니다')).toBeInTheDocument();
    });
  });

  describe('icon', () => {
    it('icon prop이 있을 때 아이콘 영역을 렌더링한다', () => {
      render(<EmptyState title="비어있음" icon={<span>📝</span>} />);
      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('icon prop이 없을 때 아이콘 영역을 렌더링하지 않는다', () => {
      const { container } = render(<EmptyState title="비어있음" />);
      expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    });

    it('아이콘 래퍼에 aria-hidden="true" 속성을 갖는다', () => {
      const { container } = render(<EmptyState title="비어있음" icon={<span>📝</span>} />);
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });
  });

  describe('description', () => {
    it('description prop이 있을 때 설명 텍스트를 표시한다', () => {
      render(<EmptyState title="비어있음" description="새 노트를 작성해보세요" />);
      expect(screen.getByText('새 노트를 작성해보세요')).toBeInTheDocument();
    });

    it('description prop이 없을 때 설명 엘리먼트를 렌더링하지 않는다', () => {
      render(<EmptyState title="비어있음" />);
      expect(screen.queryByText('새 노트를 작성해보세요')).not.toBeInTheDocument();
    });
  });

  describe('action', () => {
    it('action prop이 있을 때 액션 영역을 렌더링한다', () => {
      render(<EmptyState title="비어있음" action={<button>노트 만들기</button>} />);
      expect(screen.getByRole('button', { name: '노트 만들기' })).toBeInTheDocument();
    });

    it('action prop이 없을 때 액션 영역을 렌더링하지 않는다', () => {
      render(<EmptyState title="비어있음" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
