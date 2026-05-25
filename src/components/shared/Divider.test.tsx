import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  describe('기본 렌더링', () => {
    it('hr 엘리먼트를 렌더링한다', () => {
      const { container } = render(<Divider />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });
  });

  // aria / 시맨틱으로 검증 불가 — class·인라인 style 검증 필요
  describe.skip('(class/style) variant 스타일', () => {
    it('divider 클래스를 갖는다');
    it('기본 variant는 default이다');
    it('default variant일 때 border-subtle 색상 스타일을 갖는다');
    it('subtle variant일 때 border-subtle 색상 스타일을 갖는다');
    it('editor variant일 때 border-divider 색상 스타일을 갖는다');
  });
});
