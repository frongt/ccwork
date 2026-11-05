export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        // 본문 최소 줄 수 검사 (빈 줄 제외)
        'body-min-lines': ({ body }, when = 'always', min = 2) => {
          const lines = (body ?? '').split('\n').filter((line) => line.trim() !== '');
          const valid = lines.length >= min;
          return [
            when === 'never' ? !valid : valid,
            `본문은 최소 ${min}줄이어야 합니다 (현재 ${lines.length}줄)`,
          ];
        },
      },
    },
  ],
  rules: {
    // 한국어 subject에는 대소문자 규칙이 의미 없음
    'subject-case': [0],
    // 제목 필수
    'subject-empty': [2, 'never'],
    // 본문 필수 + 최소 두 줄
    'body-empty': [2, 'never'],
    'body-min-lines': [2, 'always', 2],
  },
};
