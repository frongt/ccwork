import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardTitle, CardPreview, CardFooter } from './Card';

describe('Card', () => {
  describe('기본 렌더링', () => {
    it('children을 표시한다', () => {
      render(<Card>카드 내용</Card>);
      expect(screen.getByText('카드 내용')).toBeInTheDocument();
    });
  });

  describe('onClick — 접근성', () => {
    it('onClick이 있을 때 role="button" 속성을 갖는다', () => {
      render(<Card onClick={vi.fn()}>내용</Card>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('onClick이 없을 때 role 속성이 없다', () => {
      const { container } = render(<Card>내용</Card>);
      expect(container.firstChild).not.toHaveAttribute('role');
    });

    it('onClick이 있을 때 tabIndex=0 속성을 갖는다', () => {
      render(<Card onClick={vi.fn()}>내용</Card>);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0');
    });

    it('클릭 시 onClick 핸들러가 호출된다', async () => {
      const onClick = vi.fn();
      render(<Card onClick={onClick}>내용</Card>);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('Enter 키 입력 시 onClick 핸들러가 호출된다', async () => {
      const onClick = vi.fn();
      render(<Card onClick={onClick}>내용</Card>);
      screen.getByRole('button').focus();
      await userEvent.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('isSelected', () => {
    it('isSelected=true일 때 aria-selected="true" 속성을 갖는다', () => {
      const { container } = render(<Card isSelected>내용</Card>);
      expect(container.firstChild).toHaveAttribute('aria-selected', 'true');
    });

    it('isSelected=false일 때 aria-selected="false" 속성을 갖는다', () => {
      const { container } = render(<Card isSelected={false}>내용</Card>);
      expect(container.firstChild).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('(class) 스타일 변형', () => {
    it('isAccent=true일 때 note-card-accent 클래스를 갖는다', () => {
      const { container } = render(<Card isAccent>내용</Card>);
      expect(container.firstChild).toHaveClass('note-card-accent');
    });

    it('onClick이 있을 때 cursor-pointer 클래스를 갖는다', () => {
      render(<Card onClick={vi.fn()}>내용</Card>);
      expect(screen.getByRole('button')).toHaveClass('cursor-pointer');
    });
  });
});

describe('CardTitle', () => {
  it('children을 표시한다', () => {
    render(<CardTitle>제목</CardTitle>);
    expect(screen.getByText('제목')).toBeInTheDocument();
  });

  describe.skip('(class)', () => {
    it('note-card-title 클래스를 갖는다');
  });
});

describe('CardPreview', () => {
  it('children을 표시한다', () => {
    render(<CardPreview>미리보기</CardPreview>);
    expect(screen.getByText('미리보기')).toBeInTheDocument();
  });

  describe.skip('(class)', () => {
    it('note-card-preview 클래스를 갖는다');
  });
});

describe('CardFooter', () => {
  it('date가 있을 때 날짜를 표시한다', () => {
    render(<CardFooter date="2024-01-01" />);
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('tags가 있을 때 태그 영역을 렌더링한다', () => {
    render(<CardFooter tags={<span>React</span>} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('actions가 있을 때 액션 영역을 렌더링한다', () => {
    render(<CardFooter actions={<button>삭제</button>} />);
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
  });

  it('date, tags, actions 모두 없어도 렌더링된다', () => {
    const { container } = render(<CardFooter />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
