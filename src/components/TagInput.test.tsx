import { render, screen, fireEvent } from '@testing-library/react';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  describe('정상', () => {
    it('should add tag as chip when user types valid text and presses Enter', () => {
      const onChange = vi.fn();
      render(<TagInput tags={[]} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'react' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(['react']);
    });

    it('should clear input field after adding tag', () => {
      const onChange = vi.fn();
      render(<TagInput tags={[]} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'react' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('');
    });

    it('should remove tag when X button is clicked', () => {
      const onChange = vi.fn();
      render(<TagInput tags={['react', 'typescript']} onChange={onChange} />);

      const deleteButtons = screen.getAllByRole('button');
      fireEvent.click(deleteButtons[0]);

      expect(onChange).toHaveBeenCalledWith(['typescript']);
    });
  });

  describe('경계', () => {
    it('should add 5th tag and then disable input', () => {
      const onChange = vi.fn();
      const tags = ['a', 'b', 'c', 'd'];
      render(<TagInput tags={tags} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'e' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(['a', 'b', 'c', 'd', 'e']);

      // 5개가 된 후 input이 disabled
      render(<TagInput tags={['a', 'b', 'c', 'd', 'e']} onChange={onChange} />);
      expect(screen.getAllByRole('textbox').pop()).toBeDisabled();
    });
  });

  describe('예외', () => {
    it('should not add tag when duplicate tag is entered', () => {
      const onChange = vi.fn();
      render(<TagInput tags={['react']} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'react' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should clear input when duplicate tag is entered', () => {
      const onChange = vi.fn();
      render(<TagInput tags={['react']} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'react' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('');
    });

    it('should disable input when tags count is 5', () => {
      const onChange = vi.fn();
      const tags = ['a', 'b', 'c', 'd', 'e'];
      render(<TagInput tags={tags} onChange={onChange} />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });
});
