export interface UseTagEditorResult {
  tags: string[];
  isInputOpen: boolean;
  inputValue: string;
  toggleInput: () => void;
  changeInput: (value: string) => void;
  addTag: () => void; // inputValue를 검증해 추가한다. Enter에서 호출된다
  reset: (initialTags: string[]) => void; // tags 교체 + 입력창 닫기 + inputValue 비우기
}

export function useTagEditor(): UseTagEditorResult {
  throw new Error('not implemented');
}
