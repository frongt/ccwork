export const MAX_TAG_LENGTH = 20;
export const MAX_TAG_COUNT = 5;

export function validateTag(input: string): { valid: boolean; normalized: string } {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed || trimmed.length > MAX_TAG_LENGTH) {
    return { valid: false, normalized: '' };
  }

  if (!/^[가-힣a-z0-9]+$/.test(trimmed)) {
    return { valid: false, normalized: '' };
  }

  return { valid: true, normalized: trimmed };
}

export function getTagError(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '태그를 입력해주세요';
  if (trimmed.length > MAX_TAG_LENGTH) return `${MAX_TAG_LENGTH}자 이하로 입력해주세요`;
  if (!/^[가-힣a-zA-Z0-9]+$/.test(trimmed)) return '한글, 영문, 숫자만 입력할 수 있습니다';
  return '';
}
