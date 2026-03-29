import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  describe('정상', () => {
    it('Enter 키를 누르면 onSearch를 호출한다', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'react' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onSearch).toHaveBeenCalledWith('react');
    });

    it('X 버튼 클릭 시 입력을 비우고 onSearch를 빈 문자열로 호출한다', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'react' } });

      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);

      expect(input).toHaveValue('');
      expect(onSearch).toHaveBeenCalledWith('');
    });
  });

  describe('경계', () => {
    it('입력 최대 길이가 100자이다', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '100');
    });
  });
});
