import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

function renderTagInput(props: Partial<React.ComponentProps<typeof TagInput>> = {}) {
  const handlers = { onToggle: vi.fn(), onChange: vi.fn(), onSubmit: vi.fn() };
  render(<TagInput isOpen={false} value="" {...handlers} {...props} />);
  return handlers;
}

describe('TagInput', () => {
  // TI1
  it('should "태그 추가" 버튼만 보이고 입력창은 숨김 when isOpen이 false', () => {
    renderTagInput({ isOpen: false });

    expect(screen.getByRole('button', { name: '태그 추가' })).toBeInTheDocument();
    expect(screen.queryByLabelText('태그 입력')).not.toBeInTheDocument();
  });

  // TI2
  it('should 버튼명이 "닫기"로 바뀌고 입력창이 보임 when isOpen이 true', () => {
    renderTagInput({ isOpen: true });

    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '태그 추가' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('태그 입력')).toBeInTheDocument();
  });

  // TI3
  it('should onToggle을 호출 when 토글 버튼을 클릭', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderTagInput({ isOpen: false });

    await user.click(screen.getByRole('button', { name: '태그 추가' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  // TI4
  it('should onChange에 입력값을 전달 when 입력창에 타이핑', async () => {
    const user = userEvent.setup();
    const { onChange } = renderTagInput({ isOpen: true, value: '' });

    await user.type(screen.getByLabelText('태그 입력'), 'a');

    expect(onChange).toHaveBeenLastCalledWith('a');
  });

  // TI5
  it('should onSubmit을 호출 when 입력창에서 Enter', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderTagInput({ isOpen: true, value: 'react' });

    await user.type(screen.getByLabelText('태그 입력'), '{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  // TI6
  it('should 기본 동작을 취소(preventDefault) when Enter', () => {
    renderTagInput({ isOpen: true, value: 'react' });

    // fireEvent는 기본 동작이 취소되면 false를 반환한다
    const notPrevented = fireEvent.keyDown(screen.getByLabelText('태그 입력'), { key: 'Enter' });

    expect(notPrevented).toBe(false);
  });

  // TI7
  it("should value를 입력창 값으로 표시 when value가 'react' 또는 ''", () => {
    const { unmount } = render(
      <TagInput isOpen value="react" onToggle={vi.fn()} onChange={vi.fn()} onSubmit={vi.fn()} />,
    );
    expect(screen.getByLabelText('태그 입력')).toHaveValue('react');
    unmount();

    render(<TagInput isOpen value="" onToggle={vi.fn()} onChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('태그 입력')).toHaveValue('');
  });

  // TI8
  it('should aria-label "태그 입력"을 가진 입력창을 렌더 when isOpen이 true', () => {
    renderTagInput({ isOpen: true });

    expect(screen.getByRole('textbox', { name: '태그 입력' })).toBeInTheDocument();
  });

  // TI9
  it('should 눈에 띄지 않는 회색 계열 토큰 클래스를 토글 버튼에 적용 when 렌더', () => {
    renderTagInput({ isOpen: false });

    expect(screen.getByRole('button', { name: '태그 추가' })).toHaveClass(
      'text-on-surface-variant',
    );
  });

  // TI10
  it('should onSubmit을 호출하지 않음 when Enter 이외의 키를 입력', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderTagInput({ isOpen: true, value: 'react' });

    await user.type(screen.getByLabelText('태그 입력'), 'a{Escape}{Tab}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  // TI11
  it('should onSubmit을 호출하지 않음 when 한글 등 IME 조합 중(isComposing)에 Enter', () => {
    const { onSubmit } = renderTagInput({ isOpen: true, value: '리액' });

    fireEvent.keyDown(screen.getByLabelText('태그 입력'), { key: 'Enter', isComposing: true });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
