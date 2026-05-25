import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  describe('기본 렌더링', () => {
    it('children을 표시한다', () => {
      render(<Button>저장</Button>);
      expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    });
  });

  describe('isLoading', () => {
    it('isLoading=true일 때 aria-busy="true" 속성을 갖는다', () => {
      render(<Button isLoading>저장</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('isLoading=true일 때 버튼이 disabled 상태가 된다', () => {
      render(<Button isLoading>저장</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('isLoading=true일 때 스피너가 렌더링된다', () => {
      const { container } = render(<Button isLoading>저장</Button>);
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('isLoading=false일 때 스피너가 렌더링되지 않는다', () => {
      const { container } = render(<Button>저장</Button>);
      expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('disabled=true일 때 버튼이 비활성화된다', () => {
      render(<Button disabled>저장</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disabled 상태일 때 클릭해도 onClick이 호출되지 않는다', async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          저장
        </Button>,
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('이벤트', () => {
    it('클릭 시 onClick 핸들러가 호출된다', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>저장</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('(class) variant / size 스타일', () => {
    it('기본 variant는 primary이다', () => {
      render(<Button>저장</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-primary');
    });

    it('primary variant일 때 btn-primary 클래스를 갖는다', () => {
      render(<Button variant="primary">저장</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-primary');
    });

    it('outline variant일 때 btn-outline 클래스를 갖는다', () => {
      render(<Button variant="outline">저장</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-outline');
    });

    it('ghost variant일 때 btn-ghost 클래스를 갖는다', () => {
      render(<Button variant="ghost">저장</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-ghost');
    });

    it('destructive variant일 때 btn-destructive 클래스를 갖는다', () => {
      render(<Button variant="destructive">저장</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-destructive');
    });

    it('sm size일 때 sm 스타일 클래스를 갖는다', () => {
      render(<Button size="sm">저장</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-xs');
    });

    it('lg size일 때 lg 스타일 클래스를 갖는다', () => {
      render(<Button size="lg">저장</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-base');
    });
  });
});
