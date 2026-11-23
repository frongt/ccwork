import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TagList } from './TagList';

describe('TagList', () => {
  // TL1
  it("should 모든 태그를 전달된 순서대로 표시 when tags가 ['react', 'design']", () => {
    render(<TagList tags={['react', 'design']} />);

    const react = screen.getByText('react');
    const design = screen.getByText('design');
    expect(react.compareDocumentPosition(design) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  // TL2
  it('should flex-wrap 컨테이너 안에 표시 when 태그가 여러 개', () => {
    render(<TagList tags={['react', 'design']} />);

    expect(screen.getByText('react').closest('.flex-wrap')).not.toBeNull();
    expect(screen.getByText('design').closest('.flex-wrap')).not.toBeNull();
  });

  // TL3
  it('should 아무것도 렌더하지 않음 when tags가 빈 배열', () => {
    const { container } = render(<TagList tags={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
