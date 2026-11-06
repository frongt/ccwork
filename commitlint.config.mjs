export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 허용 타입 엄격 제한
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'test', 'refactor', 'style', 'ci']],
    // 제목(헤더) 50자 이하
    'header-max-length': [2, 'always', 50],
    // 제목 소문자 강제 (한국어는 영향 없음)
    'subject-case': [2, 'always', 'lower-case'],
    // 본문 최소 10자 이상
    'body-min-length': [2, 'always', 10],
  },
};
