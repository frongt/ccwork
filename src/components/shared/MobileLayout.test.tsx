import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileLayout } from './MobileLayout';

describe('MobileLayout', () => {
  describe('기본 렌더링', () => {
    it('header를 렌더링한다', () => {
      render(<MobileLayout header={<header>헤더</header>}>내용</MobileLayout>);
      expect(screen.getByText('헤더')).toBeInTheDocument();
    });

    it('children을 main 영역에 렌더링한다', () => {
      render(<MobileLayout header={<header />}>본문 내용</MobileLayout>);
      const main = screen.getByRole('main');
      expect(main).toContainElement(screen.getByText('본문 내용'));
    });
  });

  describe('fab', () => {
    it('fab prop이 있을 때 FAB을 렌더링한다', () => {
      render(
        <MobileLayout header={<header />} fab={<button>+</button>}>
          내용
        </MobileLayout>,
      );
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    });

    it('fab prop이 없을 때 FAB을 렌더링하지 않는다', () => {
      render(<MobileLayout header={<header />}>내용</MobileLayout>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('bottomNav', () => {
    it('bottomNav prop이 있을 때 하단 네비게이션을 렌더링한다', () => {
      render(
        <MobileLayout header={<header />} bottomNav={<nav aria-label="하단 메뉴">메뉴</nav>}>
          내용
        </MobileLayout>,
      );
      expect(screen.getByRole('navigation', { name: '하단 메뉴' })).toBeInTheDocument();
    });

    it('bottomNav prop이 없을 때 하단 네비게이션을 렌더링하지 않는다', () => {
      render(<MobileLayout header={<header />}>내용</MobileLayout>);
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });

  // 인라인 style 값으로만 검증 가능 — 별도 처리 필요
  describe.skip('(style) main paddingBottom', () => {
    it('bottomNav가 있을 때 main의 paddingBottom이 nav 높이를 고려한다');
    it('bottomNav가 없을 때 main의 paddingBottom이 fab 크기만 고려한다');
  });
});
