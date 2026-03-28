---
name: tdd-green
description: 현재 실패 중인 테스트를 통과시키는 최소한의 구현 코드만 작성합니다. `/tdd-green {issue-number}` 형태로 호출. TDD Green 단계 — 테스트를 한 건씩 통과시키며 구현하고, 테스트 파일은 절대 수정하지 않습니다.
---

# TDD Green — 실패 테스트를 통과시키는 최소 구현

## 입력

`$ARGUMENTS`로 이슈 번호를 받는다. 예: `/tdd-green 1`

## 절대 규칙

- **테스트 파일(`*.test.ts`, `*.test.tsx`)은 절대 수정하지 않는다**
- **테스트에 없는 기능은 구현하지 않는다**
- **불필요한 추상화를 만들지 않는다** — 테스트를 통과시키는 최소한의 코드만 작성
- 한 번에 하나의 실패 테스트만 집중한다

---

## Step 1: 컨텍스트 읽기

1. `docs/features/tag/issue-{N}.md`에서 확정 시그니처와 테스트 시나리오를 읽는다
2. 실패 중인 테스트 파일들을 모두 읽는다
3. 테스트가 import하는 소스 파일들의 존재 여부를 확인한다

---

## Step 2: 전체 실패 현황 파악

```bash
npm test -- --reporter=verbose 2>&1
```

### collect 실패 감지

vitest는 import할 모듈이 없으면 테스트를 collect하지 못한다.
이 경우 해당 파일의 테스트는 카운트에서 **완전히 누락**된다.

**확인 방법**: 시나리오 문서(`docs/features/tag/issue-{N}.md`)의 체크박스(`- [ ]`) 총 건수와 vitest가 보고하는 `Tests` 수를 비교한다. 불일치하면 collect 실패가 있는 것.

**해결**: collect 실패한 파일의 import 대상부터 빈 껍데기(stub)로 생성한다.

```ts
// 예: src/utils/tagValidation.ts (stub)
export function validateTag(input: string): { valid: boolean; normalized: string } {
  return { valid: false, normalized: '' };
}
```

stub 생성 후 다시 `npm test`를 실행하여 **전체 테스트 수가 시나리오 문서의 총 건수와 일치**하는지 확인한다.
일치하지 않으면 원인을 찾아 해결한 뒤 진행한다.

---

## Step 3: 테스트 통과 루프

시나리오 문서의 순서(정상 → 경계 → 예외)대로, 파일 의존성 순서로 진행한다:
순수 함수 → UI 컴포넌트 → 통합 컴포넌트

각 실패 테스트마다:

### 3-1. 실패 테스트 1건 확인

```bash
npm test -- --reporter=verbose {테스트파일경로}
```

실패 메시지를 읽고, 통과에 필요한 최소 변경을 파악한다.

### 3-2. 최소 구현

테스트가 요구하는 동작만 구현한다. "나중에 필요할 것 같은" 코드는 작성하지 않는다.

### 3-3. 통과 확인

```bash
npm test -- --reporter=verbose {테스트파일경로}
```

- PASS → Step 3-4로
- FAIL → 실패 메시지를 읽고 구현을 수정. 테스트 파일은 수정 금지

### 3-4. 시나리오 체크

`docs/features/tag/issue-{N}.md`에서 통과한 시나리오를 `[x]`로 체크한다.

### 3-5. 회귀 확인

```bash
npm test
```

전체 테스트에서 새로운 실패가 생기지 않았는지 확인한다.
회귀가 발생하면 즉시 수정한 뒤 다음 테스트로 이동한다.

### 3-6. 다음 실패 테스트로 이동

전체 통과할 때까지 3-1 ~ 3-5를 반복한다.

---

## Step 4: 전체 통과 확인

```bash
npm test -- --reporter=verbose
```

모든 테스트가 PASS인지 확인한다.

---

## Step 5: 커버리지 측정

```bash
npx vitest run --coverage
```

### 커버리지 분석

- 미커버 라인을 확인한다
- 시나리오 문서에서 빠진 케이스인지 판단한다
- **커버리지를 올리기 위한 테스트 추가는 금지** — 참고용으로만 보고한다

---

## Step 6: 완료 보고

```
TDD Green 완료: Issue #{N}

구현 파일:
  - src/utils/tagValidation.ts
  - src/components/TagInput.tsx
  - (수정된 파일 목록)

테스트 결과: {통과}/{전체} PASS

커버리지:
  - tagValidation.ts: {n}%
  - TagInput.tsx: {n}%
  - NoteEditor.tsx: {n}%

미커버 라인:
  - {파일}:{라인} — {설명} (시나리오 누락 여부: O/X)
```
