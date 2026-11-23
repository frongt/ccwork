import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTagEditor } from './useTagEditor';

function addTagByTyping(result: { current: ReturnType<typeof useTagEditor> }, text: string) {
  act(() => result.current.changeInput(text));
  act(() => result.current.addTag());
}

describe('useTagEditor', () => {
  // H1
  it("should tags [], isInputOpen false, inputValue ''로 시작 when 마운트", () => {
    const { result } = renderHook(() => useTagEditor());

    expect(result.current.tags).toEqual([]);
    expect(result.current.isInputOpen).toBe(false);
    expect(result.current.inputValue).toBe('');
  });

  describe('toggleInput', () => {
    // H2
    it('should isInputOpen을 true로 when 닫힌 상태에서 호출', () => {
      const { result } = renderHook(() => useTagEditor());

      act(() => result.current.toggleInput());

      expect(result.current.isInputOpen).toBe(true);
    });

    // H3
    it('should isInputOpen을 false로 when 열린 상태에서 호출', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => result.current.toggleInput());

      act(() => result.current.toggleInput());

      expect(result.current.isInputOpen).toBe(false);
    });
  });

  describe('changeInput', () => {
    // H4
    it('should inputValue를 전달한 값으로 갱신 when 값을 전달', () => {
      const { result } = renderHook(() => useTagEditor());

      act(() => result.current.changeInput('rea'));

      expect(result.current.inputValue).toBe('rea');
    });
  });

  describe('addTag', () => {
    // H5
    it("should trim된 태그를 tags 끝에 추가하고 inputValue를 ''로 비움 when inputValue가 '  react  '", () => {
      const { result } = renderHook(() => useTagEditor());

      addTagByTyping(result, '  react  ');

      expect(result.current.tags).toEqual(['react']);
      expect(result.current.inputValue).toBe('');
    });

    // H6
    it("should 입력 순서대로 tags에 쌓고 isInputOpen을 유지 when 'react', 'design'을 연속 추가", () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => result.current.toggleInput());

      addTagByTyping(result, 'react');
      addTagByTyping(result, 'design');

      expect(result.current.tags).toEqual(['react', 'design']);
      expect(result.current.isInputOpen).toBe(true);
    });

    // H8
    it('should 상태를 바꾸지 않음 when inputValue가 빈 문자열', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => result.current.reset(['react']));

      act(() => result.current.addTag());

      expect(result.current.tags).toEqual(['react']);
      expect(result.current.inputValue).toBe('');
    });

    // H9
    it('should 상태를 바꾸지 않음 when inputValue가 공백만', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => result.current.reset(['react']));
      act(() => result.current.changeInput('   '));

      act(() => result.current.addTag());

      expect(result.current.tags).toEqual(['react']);
      expect(result.current.inputValue).toBe('   ');
    });

    // H11
    it('should reset에 전달한 initialTags 배열을 변경하지 않음 when reset 후 태그를 추가', () => {
      const { result } = renderHook(() => useTagEditor());
      const initialTags = ['react'];
      act(() => result.current.reset(initialTags));

      addTagByTyping(result, 'design');

      expect(initialTags).toEqual(['react']);
      expect(result.current.tags).toEqual(['react', 'design']);
    });
  });

  describe('reset', () => {
    // H7
    it("should tags를 initialTags로 교체하고 isInputOpen false, inputValue ''로 when 태그 입력 중인 상태에서 호출", () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => result.current.toggleInput());
      addTagByTyping(result, 'old');
      act(() => result.current.changeInput('typing'));

      act(() => result.current.reset(['react', 'design']));

      expect(result.current.tags).toEqual(['react', 'design']);
      expect(result.current.isInputOpen).toBe(false);
      expect(result.current.inputValue).toBe('');
    });

    // H10
    it('should tags를 빈 배열로 when initialTags가 [] (tags가 없는 기존 노트)', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => result.current.reset(['react']));

      act(() => result.current.reset([]));

      expect(result.current.tags).toEqual([]);
    });

    // H12
    it('should 이전 노트의 태그가 남지 않음 when 다른 initialTags로 연속 reset', () => {
      const { result } = renderHook(() => useTagEditor());

      act(() => result.current.reset(['react', 'design']));
      act(() => result.current.reset(['vue']));

      expect(result.current.tags).toEqual(['vue']);
    });
  });
});
