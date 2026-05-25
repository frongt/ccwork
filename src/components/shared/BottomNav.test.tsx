import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomNav } from './BottomNav';
import type { BottomNavItem } from './BottomNav';

const makeItems = (count = 2): BottomNavItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    label: `메뉴 ${i}`,
    icon: () => <span />,
    onClick: vi.fn(),
  }));

describe('BottomNav', () => {
  describe('기본 렌더링', () => {
    it('nav 엘리먼트를 렌더링한다', () => {
      render(<BottomNav items={makeItems()} activeId="item-0" />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('items 배열만큼 버튼을 렌더링한다', () => {
      render(<BottomNav items={makeItems(3)} activeId="item-0" />);
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('각 버튼에 label을 aria-label로 설정한다', () => {
      render(<BottomNav items={makeItems(2)} activeId="item-0" />);
      expect(screen.getByRole('button', { name: '메뉴 0' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '메뉴 1' })).toBeInTheDocument();
    });

    it('각 버튼에 label 텍스트를 표시한다', () => {
      render(<BottomNav items={makeItems(2)} activeId="item-0" />);
      expect(screen.getByText('메뉴 0')).toBeInTheDocument();
      expect(screen.getByText('메뉴 1')).toBeInTheDocument();
    });
  });

  describe('activeId', () => {
    it('active 아이템의 icon 함수를 true 인자로 호출한다', () => {
      const iconSpy = vi.fn(() => <span />);
      const items: BottomNavItem[] = [{ id: 'home', label: '홈', icon: iconSpy }];
      render(<BottomNav items={items} activeId="home" />);
      expect(iconSpy).toHaveBeenCalledWith(true);
    });

    it('비활성 아이템의 icon 함수를 false 인자로 호출한다', () => {
      const iconSpy = vi.fn(() => <span />);
      const items: BottomNavItem[] = [
        { id: 'home', label: '홈', icon: () => <span /> },
        { id: 'search', label: '검색', icon: iconSpy },
      ];
      render(<BottomNav items={items} activeId="home" />);
      expect(iconSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('이벤트', () => {
    it('버튼 클릭 시 해당 아이템의 onClick 핸들러가 호출된다', async () => {
      const onClick = vi.fn();
      const items: BottomNavItem[] = [{ id: 'home', label: '홈', icon: () => <span />, onClick }];
      render(<BottomNav items={items} activeId="home" />);
      await userEvent.click(screen.getByRole('button', { name: '홈' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // aria로 활성 상태를 표현하는 속성 없음 — class 검증 필요
  describe.skip('(class) 활성 상태 스타일', () => {
    it('activeId와 일치하는 아이템 버튼에 active 클래스를 갖는다');
    it('activeId와 일치하지 않는 아이템 버튼에 active 클래스가 없다');
  });
});
