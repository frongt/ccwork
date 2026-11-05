export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 한국어 subject에는 대소문자 규칙이 의미 없음
    'subject-case': [0],
  },
};
