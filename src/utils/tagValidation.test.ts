import { validateTag } from './tagValidation';

describe('validateTag', () => {
  describe('정상', () => {
    it('should return { valid: true, normalized: "react" } when input is "React"', () => {
      const result = validateTag('React');
      expect(result).toEqual({ valid: true, normalized: 'react' });
    });
  });

  describe('경계', () => {
    it('should return valid when tag is exactly 20 characters', () => {
      const input = 'a'.repeat(20);
      const result = validateTag(input);
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe(input);
    });

    it('should return valid when tag is 1 character', () => {
      const result = validateTag('a');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('a');
    });

    it('should normalize "REACT" to "react"', () => {
      const result = validateTag('REACT');
      expect(result).toEqual({ valid: true, normalized: 'react' });
    });

    it('should return valid when tag contains Korean characters ("태그")', () => {
      const result = validateTag('태그');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('태그');
    });

    it('should return valid when tag contains mixed Korean and numbers ("태그123")', () => {
      const result = validateTag('태그123');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('태그123');
    });
  });

  describe('예외', () => {
    it('should return invalid when input contains special characters ("tag!")', () => {
      const result = validateTag('tag!');
      expect(result).toEqual({ valid: false, normalized: '' });
    });

    it('should return invalid when input is 21 characters', () => {
      const input = 'a'.repeat(21);
      const result = validateTag(input);
      expect(result).toEqual({ valid: false, normalized: '' });
    });

    it('should return invalid when input is empty string', () => {
      const result = validateTag('');
      expect(result).toEqual({ valid: false, normalized: '' });
    });

    it('should return invalid when input contains spaces ("my tag")', () => {
      const result = validateTag('my tag');
      expect(result).toEqual({ valid: false, normalized: '' });
    });
  });
});
