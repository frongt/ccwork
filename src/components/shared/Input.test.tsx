import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  describe('기본 렌더링', () => {
    it('input 엘리먼트를 렌더링한다', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('label prop이 있을 때 label 엘리먼트를 표시한다', () => {
      render(<Input label="이름" />);
      expect(screen.getByText('이름')).toBeInTheDocument();
    });

    it('label과 input이 getByLabelText로 조회된다', () => {
      render(<Input label="이름" />);
      expect(screen.getByLabelText('이름')).toBeInTheDocument();
    });

    it('label prop이 없을 때 label 엘리먼트가 없다', () => {
      render(<Input />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });
  });

  describe('errorMessage', () => {
    it('errorMessage가 있을 때 에러 텍스트를 표시한다', () => {
      render(<Input errorMessage="필수 항목입니다" />);
      expect(screen.getByText('필수 항목입니다')).toBeInTheDocument();
    });

    it('errorMessage가 있을 때 aria-invalid="true" 속성을 갖는다', () => {
      render(<Input errorMessage="필수 항목입니다" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('errorMessage가 있을 때 aria-describedby로 에러 엘리먼트와 연결된다', () => {
      render(<Input errorMessage="필수 항목입니다" />);
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(document.getElementById(errorId!)).toBeInTheDocument();
    });

    it('errorMessage가 없을 때 에러 텍스트가 없다', () => {
      render(<Input />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('errorMessage가 없을 때 aria-invalid가 false이다', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('id', () => {
    it('id prop을 전달하면 해당 id를 사용한다', () => {
      render(<Input id="my-input" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input');
    });

    it('id prop이 없으면 자동 생성된 id를 사용한다', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
      expect(input.getAttribute('id')).not.toBe('');
    });
  });
});
