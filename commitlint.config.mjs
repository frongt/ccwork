export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 허용 타입 엄격 제한
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'test', 'refactor', 'style', 'ci']],
    // 제목 대소문자 규칙 해제 (CLAUDE.md 등 파일명 표기 허용)
    'subject-case': [0],
    // 제목(헤더) 50자 이하
    'header-max-length': [2, 'always', 50],
    // 본문 최소 10자 이상
    'body-min-length': [2, 'always', 10],
  },
};
