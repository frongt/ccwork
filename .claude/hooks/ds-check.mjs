// PostToolUse hook (Edit|Write): 디자인 시스템 금지 패턴을 경고한다. 차단하지 않는다(항상 exit 0).
// 규칙 원문: docs/design-system/rules/do-and-dont.md
import { readFileSync } from 'node:fs';

const RULES = [
  { re: /(?<![\w-])border-[brtl](?:-\d+)?(?![\w-])/, msg: '구분선(border-b/r/t/l)은 금지. 배경색 차이와 간격으로 구분' },
  { re: /(?<![\w-])divide-[xy]/, msg: '구분선(divide-x/y)은 금지. gap으로 구분' },
  { re: /(?<![\w-])h-px(?![\w-])/, msg: '구분선(h-px)은 금지' },
  { re: /(?<![\w-])(?:text|bg|border)-black(?![\w-])/, msg: '순수 검정 금지. on-surface 계열 토큰 사용' },
  { re: /#000(?:000)?(?![0-9a-fA-F])/, msg: '순수 검정(#000) 금지. on-surface 계열 토큰 사용' },
  { re: /(?<![\w-])(?:text|bg|border)-gray-\d+/, msg: 'gray-* 금지. 시맨틱 토큰 사용' },
  { re: /(?<![\w-])(?:text|bg|border)-(?:blue|green|amber|red)-\d+/, msg: 'Tailwind 기본 상태색 금지. status-* 토큰 사용' },
  { re: /(?<![\w-])shadow-(?:sm|md|lg|xl|2xl)(?![\w-])/, msg: '기본 그림자 금지. Ambient Shadow 사용' },
  { re: /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,/, msg: '검정 기반 그림자 금지. Ambient Shadow 사용' },
  { re: /Boogaloo/, msg: '폰트는 Inter(+Pretendard 폴백)만 사용' },
];

let input = {};
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const file = String(input?.tool_input?.file_path ?? '').replace(/\\/g, '/');
if (!/\/src\/.*\.(tsx|css)$/.test(file)) process.exit(0);

let source;
try {
  source = readFileSync(file, 'utf8');
} catch {
  process.exit(0);
}
const lines = source.split(/\r?\n/);
const shortFile = file.split('/src/')[1] ? 'src/' + file.split('/src/')[1] : file;

const found = [];
lines.forEach((line, i) => {
  for (const { re, msg } of RULES) {
    if (re.test(line)) found.push(`${shortFile}:${i + 1} ${msg}`);
  }
});

// input/textarea/select 태그는 여러 줄에 걸치므로 태그 단위로 검사한다 (aria-label 필수, type="hidden" 제외).
// 속성 안의 `=>`나 문자열의 `>`에 속지 않도록 중괄호 깊이와 따옴표를 추적해 태그 끝을 찾는다.
if (file.endsWith('.tsx')) {
  const tagRe = /<(input|textarea|select)(?=[\s/>])/g;
  let m;
  while ((m = tagRe.exec(source))) {
    let i = m.index + m[0].length;
    let depth = 0;
    let quote = null;
    for (; i < source.length; i++) {
      const ch = source[i];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'" || (ch === '`' && depth > 0)) {
        quote = ch;
      } else if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (ch === '>' && depth === 0) break;
    }
    const tag = source.slice(m.index, i + 1);
    if (/type\s*=\s*["']hidden["']/.test(tag)) continue;
    if (!/(?<![\w-])aria-label\s*=/.test(tag)) {
      const lineNo = source.slice(0, m.index).split(/\r?\n/).length;
      found.push(`${shortFile}:${lineNo} <${m[1]}>에 aria-label이 없음. 모든 입력 요소에 aria-label 필수`);
    }
  }
}

if (found.length === 0) process.exit(0);

const text =
  '[디자인 시스템 경고] 금지 패턴이 발견되었습니다. 차단하지는 않지만 확인하세요.\n' +
  found.map((f) => `- ${f}`).join('\n') +
  '\n(migration.md에 기록된 기존 항목이면 마이그레이션 때 해소한다. 새로 넣은 코드라면 규칙에 맞게 고친다.)';

process.stdout.write(
  JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: text } }),
);
process.exit(0);
