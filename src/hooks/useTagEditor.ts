import { useState } from 'react';
import { validateTag } from '../utils/tags';

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
  const [tags, setTags] = useState<string[]>([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleInput = () => setIsInputOpen((prev) => !prev);

  const changeInput = (value: string) => setInputValue(value);

  const addTag = () => {
    const result = validateTag(inputValue, tags);
    if (!result.canAdd) return;
    setTags([...tags, result.tag]);
    setInputValue('');
  };

  const reset = (initialTags: string[]) => {
    setTags([...initialTags]);
    setIsInputOpen(false);
    setInputValue('');
  };

  return { tags, isInputOpen, inputValue, toggleInput, changeInput, addTag, reset };
}
