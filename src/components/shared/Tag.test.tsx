import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './Tag';

describe('Tag', () => {
  describe('기본 렌더링', () => {
    it('label 텍스트를 표시한다', () => {
      render(<Tag label="React" />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  describe('onRemove (에디터 모드)', () => {
    it('onRemove가 있을 때 삭제 버튼을 표시한다', () => {
      render(<Tag label="React" onRemove={vi.fn()} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('onRemove가 없을 때 삭제 버튼이 없다', () => {
      render(<Tag label="React" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('삭제 버튼의 aria-label에 label이 포함된다', () => {
      render(<Tag label="React" onRemove={vi.fn()} />);
      expect(screen.getByRole('button', { name: /React/ })).toBeInTheDocument();
    });

    it('삭제 버튼 클릭 시 onRemove 핸들러가 호출된다', async () => {
      const onRemove = vi.fn();
      render(<Tag label="React" onRemove={onRemove} />);
      await userEvent.click(screen.getByRole('button'));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('(class) color / 에디터 스타일', () => {
    it('기본 color는 indigo이다', () => {
      const { container } = render(<Tag label="React" />);
      expect(container.firstChild).toHaveClass('tag-indigo');
    });

    it('indigo color일 때 tag-indigo 클래스를 갖는다', () => {
      const { container } = render(<Tag label="React" color="indigo" />);
      expect(container.firstChild).toHaveClass('tag-indigo');
    });

    it('pink color일 때 tag-pink 클래스를 갖는다', () => {
      const { container } = render(<Tag label="React" color="pink" />);
      expect(container.firstChild).toHaveClass('tag-pink');
    });

    it('rose color일 때 tag-rose 클래스를 갖는다', () => {
      const { container } = render(<Tag label="React" color="rose" />);
      expect(container.firstChild).toHaveClass('tag-rose');
    });

    it('onRemove가 있을 때 tag-editor 클래스를 갖는다', () => {
      const { container } = render(<Tag label="React" onRemove={vi.fn()} />);
      expect(container.firstChild).toHaveClass('tag-editor');
    });
  });
});
