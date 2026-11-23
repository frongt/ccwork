import { describe, expect, it } from 'vitest';
import { validateTag } from './tags';

describe('validateTag', () => {
  // V1
  it("should canAdd true, trim된 tag, message null을 반환 when 앞뒤 공백이 있는 유효 입력('  react  ')", () => {
    expect(validateTag('  react  ', [])).toEqual({ canAdd: true, tag: 'react', message: null });
  });

  // V2
  it("should 입력을 그대로 tag로 반환 when 공백이 없는 입력('react')", () => {
    expect(validateTag('react', []).tag).toBe('react');
  });

  // V3
  it("should canAdd false, tag '', message null을 반환 when 빈 문자열", () => {
    expect(validateTag('', [])).toEqual({ canAdd: false, tag: '', message: null });
  });

  // V4
  it("should canAdd false, tag '', message null을 반환 when 공백·탭·줄바꿈만 있는 입력", () => {
    expect(validateTag(' \t\n ', [])).toEqual({ canAdd: false, tag: '', message: null });
  });

  // V5
  it("should 중간 공백을 유지 when 'react native'처럼 단어 사이에 공백이 있는 입력", () => {
    expect(validateTag('react native', []).tag).toBe('react native');
  });

  // V6
  it('should 던지지 않고 결과 객체를 반환 when 빈 값이나 공백만 입력', () => {
    expect(() => validateTag('   ', [])).not.toThrow();
    expect(validateTag('   ', [])).toEqual(expect.objectContaining({ canAdd: false }));
  });
});
