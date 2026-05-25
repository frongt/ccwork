import { describe, it, expect } from 'vitest';
import { stripHtml } from './stripHtml';

describe('stripHtml', () => {
  it('HTML 태그를 제거한다', () => {
    expect(stripHtml('<p>안녕하세요</p>')).toBe('안녕하세요');
  });

  it('여러 태그가 있으면 모두 제거한다', () => {
    expect(stripHtml('<p>첫째</p><p>둘째</p>')).toBe('첫째 둘째');
  });

  it('&nbsp;를 공백으로 변환한다', () => {
    expect(stripHtml('<p>React와&nbsp;TypeScript</p>')).toBe('React와 TypeScript');
  });

  it('&amp;를 &로 변환한다', () => {
    expect(stripHtml('<p>A&amp;B</p>')).toBe('A&B');
  });

  it('&lt;와 &gt;를 꺾쇠로 변환한다', () => {
    expect(stripHtml('<p>&lt;div&gt;</p>')).toBe('<div>');
  });

  it('&quot;를 따옴표로 변환한다', () => {
    expect(stripHtml('<p>&quot;안녕&quot;</p>')).toBe('"안녕"');
  });

  it('연속된 공백을 하나로 줄인다', () => {
    expect(stripHtml('<p>a</p>   <p>b</p>')).toBe('a b');
  });

  it('앞뒤 공백을 제거한다', () => {
    expect(stripHtml('  <p>내용</p>  ')).toBe('내용');
  });

  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(stripHtml('')).toBe('');
  });

  it('태그가 없는 plain text는 그대로 반환한다', () => {
    expect(stripHtml('안녕하세요')).toBe('안녕하세요');
  });
});
