export function validateTag(input: string): { valid: boolean; normalized: string } {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed || trimmed.length > 20) {
    return { valid: false, normalized: '' };
  }

  if (!/^[가-힣a-z0-9]+$/.test(trimmed)) {
    return { valid: false, normalized: '' };
  }

  return { valid: true, normalized: trimmed };
}
