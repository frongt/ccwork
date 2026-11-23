import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  // T1
  it("should label 텍스트를 표시 when label이 'react'", () => {
    render(<Tag label="react" />);

    expect(screen.getByText('react')).toBeInTheDocument();
  });
});
