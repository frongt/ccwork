export interface TagValidationResult {
  canAdd: boolean; // 추가 가능 여부
  tag: string; // trim된 값
  message: string | null; // 안내 문구. 이번 이슈에서는 항상 null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateTag(_input: string, _existing: string[]): TagValidationResult {
  throw new Error('not implemented');
}
