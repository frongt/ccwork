module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-max-length': [2, 'always', 72],
    'body-empty': [2, 'never'],
    'body-min-length': [2, 'always', 20],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'footer-leading-blank': [2, 'always'],
  },
};
