import { describe, it, expect } from 'vitest';
import { migrateContent } from './migrateContent';

describe('migrateContent', () => {
  it('빈 문자열은 빈 단락으로 변환한다', () => {
    expect(migrateContent('')).toBe('<p></p>');
  });

  it('이미 HTML 태그로 시작하면 그대로 반환한다', () => {
    const html = '<p>기존 HTML 내용</p>';
    expect(migrateContent(html)).toBe(html);
  });

  it('plain text를 p 태그로 감싼다', () => {
    expect(migrateContent('안녕하세요')).toBe('<p>안녕하세요</p>');
  });

  it('줄바꿈이 있는 plain text를 각각 p 태그로 변환한다', () => {
    expect(migrateContent('첫째 줄\n둘째 줄')).toBe('<p>첫째 줄</p><p>둘째 줄</p>');
  });

  it('빈 줄은 무시한다', () => {
    expect(migrateContent('첫째 줄\n\n둘째 줄')).toBe('<p>첫째 줄</p><p>둘째 줄</p>');
  });
});
