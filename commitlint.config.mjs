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
    // 허용 타입 엄격 제한
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'chore', 'test', 'refactor', 'style', 'ci'],
    ],
    // 제목(헤더) 50자 이하
    'header-max-length': [2, 'always', 50],
    // 제목 소문자 강제 (한국어는 영향 없음)
    'subject-case': [2, 'always', 'lower-case'],
    // 제목 마침표 금지
    'subject-full-stop': [2, 'never', '.'],
    // 제목 필수
    'subject-empty': [2, 'never'],
    // 본문 필수 + 최소 두 줄
    'body-empty': [2, 'never'],
    'body-min-lines': [2, 'always', 2],
  },
};
