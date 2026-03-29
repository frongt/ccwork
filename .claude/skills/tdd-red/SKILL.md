---
name: tdd-red
description: 승인된 테스트 시나리오(docs/features/tag/issue-{N}.md)를 실패하는 테스트 코드로 작성합니다. `/tdd-red {issue-number}` 형태로 호출. TDD Red 단계 — 테스트만 작성하고 구현 코드는 절대 수정하지 않습니다.
---

# TDD Red — 실패하는 테스트 작성

## 입력

`$ARGUMENTS`로 이슈 번호를 받는다. 예: `/tdd-red 1`

## 절대 규칙

- **테스트 파일만 생성/수정한다**
- **src/의 구현 코드는 절대 수정하지 않는다** (컴포넌트, 유틸, API, Context, 타입 모두 포함)
- 모든 테스트는 **실패해야 한다** — PASS하는 테스트가 있으면 잘못된 것

---

## Step 1: 컨텍스트 읽기

1. `docs/features/tag/issue-{N}.md`에서 확정 시그니처와 테스트 시나리오를 읽는다
2. `CLAUDE.md`에서 테스트 설정을 확인한다:
   - Vitest (jsdom 환경)
   - `@testing-library/react` + `jest-dom`
   - 테스트 셋업: `src/test-setup.ts`
3. 기존 테스트 파일이 있으면 패턴을 참고한다

---

## Step 2: 테스트 코드 작성

### 파일 컨벤션

테스트 파일은 **테스트 대상 파일과 같은 디렉토리**에 위치한다:

```
src/utils/tagValidation.ts      → src/utils/tagValidation.test.ts
src/components/TagInput.tsx      → src/components/TagInput.test.tsx
src/components/NoteEditor.tsx    → src/components/NoteEditor.test.tsx
```

네이밍: `{파일명}.test.ts` (순수 함수) / `{파일명}.test.tsx` (컴포넌트)

### describe 블록

함수/컴포넌트 단위로 묶고, 정상/경계/예외로 분류:

```ts
describe('validateTag', () => {
  describe('정상', () => {
    it('should return { valid: true, normalized: "react" } when input is "React"', () => {
      const result = validateTag('React');
      expect(result).toEqual({ valid: true, normalized: 'react' });
    });
  });

  describe('경계', () => { ... });
  describe('예외', () => { ... });
});
```

### import 패턴

**순수 함수 테스트**:

```ts
import { validateTag } from './tagValidation';
```

**컴포넌트 테스트**:

```ts
import { render, screen, fireEvent } from '@testing-library/react';
import { TagInput } from './TagInput';
```

**Context 의존 컴포넌트** (NoteEditor 등):

- NotesProvider로 감싸거나 Context를 mock
- 기존 NoteEditor 테스트 패턴이 있으면 따른다

### 테스트 이름

시나리오 문장을 그대로 사용:

```ts
it('should add tag as chip when user types valid text and presses Enter', () => {
```

### 순서

시나리오 문서의 순서대로 작성: 정상 → 경계 → 예외

---

## Step 3: 개별 실행 확인

각 테스트 파일 작성 후 즉시 실행:

```bash
npm test -- --reporter=verbose {테스트파일경로}
```

- 모든 테스트가 FAIL이면 정상 → 다음 파일로 이동
- PASS하는 테스트가 있으면:
  ```
  ⚠️ 경고: {테스트이름}이 PASS했습니다.
  Red 단계에서 PASS하면 안 됩니다. 테스트를 점검하세요.
  ```
  해당 테스트를 수정하여 실패하도록 한다 (단, 무의미한 실패가 아닌 의도된 실패)

---

## Step 4: 전체 실패 확인

모든 테스트 파일 작성 완료 후:

```bash
npm test
```

### 완료 보고

```
TDD Red 완료: Issue #{N}

테스트 파일:
  - src/utils/tagValidation.test.ts ({n}건)
  - src/components/TagInput.test.tsx ({n}건)
  - src/components/NoteEditor.test.tsx ({n}건)

총 {N}건 테스트 — 전체 FAIL 확인 ✓
```
