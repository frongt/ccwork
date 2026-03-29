---
name: test-scenarios
description: 이슈 단위로 함수/컴포넌트 시그니처 확정 → 테스트 시나리오 도출을 순서대로 처리합니다. `/test-scenarios {issue-number}` 형태로 호출. TDD 방법론 기반 테스트 코드 구현 전 단계. 구현 코드는 절대 작성하지 않으며, 시그니처와 시나리오만 도출합니다.
---

# Test Scenarios — 시그니처 확정 & 테스트 시나리오 도출

## 입력

`$ARGUMENTS`로 이슈 번호를 받는다. 예: `/test-scenarios 1`

## 사전 준비

1. Git remote에서 저장소 정보를 읽는다:
   ```
   gh repo view --json nameWithOwner -q .nameWithOwner
   ```
2. 이슈 내용을 가져온다:
   ```
   gh issue view {N} --repo {owner/repo} --json title,body
   ```
3. 아래 파일을 읽어 컨텍스트를 확보한다:
   - `docs/features/tag/prd.md` — 아키텍처, 데이터 구조, 컴포넌트 설계
   - `CLAUDE.md` — 기존 패턴, 네이밍 규칙
   - `src/types/note.ts` — 현재 타입 정의
   - `src/api/notes.ts` — API 함수 시그니처 패턴
   - `src/context/NotesContext.tsx` — Context 패턴
   - `src/components/NoteEditor.tsx` — 컴포넌트 Props 패턴

---

## Step 1: 시그니처 확정

이슈 AC와 PRD를 분석하여 아래 항목을 도출한다.

### 도출 항목

**타입 변경/추가:**

```
interface 이름 {
  필드: 타입;
}
```

**함수 시그니처:**

```
함수명(파라미터: 타입): 반환타입
```

- 에러 케이스: 어떤 조건에서 에러를 던지는지 명시

**컴포넌트 Props:**

```
interface 컴포넌트Props {
  prop명: 타입;
}
```

### 규칙

- **구현 코드는 절대 작성하지 않는다** — 타입과 시그니처만
- 기존 패턴을 따른다:
  - API 함수: `src/api/notes.ts`의 `fetchNotes`, `createNote` 패턴
  - Context: `NotesContext`의 `addNote`, `editNote` 패턴
  - Props: 기존 컴포넌트의 `interface XxxProps` 인라인 선언 패턴
  - 네이밍: CLAUDE.md의 네이밍 규칙 (handle*, on*, is*, use*)
- 이슈 AC에 없는 시그니처는 만들지 않는다

---

## Step 2: 시그니처 검토/승인

도출한 시그니처를 개발자에게 보여준다. 아래 형식으로 출력:

```
## 시그니처 검토 요청 (Issue #{N})

### 타입 변경
(변경/추가되는 인터페이스)

### 함수 시그니처
(새로 추가되거나 변경되는 함수)

### 컴포넌트 Props
(새로 추가되거나 변경되는 Props)

### 에러 케이스
(각 함수의 에러 조건)
```

**승인 전까지 다음 단계로 넘어가지 않는다.**
개발자가 수정 요청하면 반영 후 다시 보여준다.

---

## Step 3: 시그니처 기록

승인된 시그니처를 `docs/features/tag/issue-{N}.md` 파일 상단에 기록한다.

파일 형식:

```markdown
# Issue #{N}: {이슈 제목}

## 확정 시그니처

### 타입

(승인된 타입 정의)

### 함수

(승인된 함수 시그니처 + 에러 케이스)

### 컴포넌트 Props

(승인된 Props 정의)
```

---

## Step 4: 테스트 시나리오 도출

승인된 시그니처를 기반으로 테스트 시나리오를 도출한다.

### 분류 기준

| 분류 | 설명                                 | 예시                                |
| ---- | ------------------------------------ | ----------------------------------- |
| 정상 | 기본 동작이 올바르게 작동하는 케이스 | 유효한 태그 추가                    |
| 경계 | 허용 범위의 끝에서 동작하는 케이스   | 정확히 20자 태그, 정확히 5개째 태그 |
| 예외 | 잘못된 입력이나 에러 상황            | 특수문자 포함, 21자 태그            |

### 시나리오 형식

```
[분류] 대상 — should {기대동작} when {조건}
```

예시:

```
[정상] TagInput — should add tag as chip when user types valid text and presses Enter
[경계] TagInput — should add tag when tag is exactly 20 characters
[예외] TagInput — should not add tag when tag contains special characters
```

### 규칙

- 이슈 AC와 1:1 대응 — 모든 AC가 최소 하나의 시나리오로 커버되어야 한다
- 하나의 시나리오는 하나의 동작만 검증한다
- **테스트 코드는 작성하지 않는다** — 시나리오 문장만

---

## Step 5: 시나리오 기록

도출된 시나리오를 `docs/features/tag/issue-{N}.md` 하단에 추가한다.

추가 형식:

```markdown
---

## 테스트 시나리오

### 정상

- [ ] [정상] 대상 — should ...
- [ ] [정상] 대상 — should ...

### 경계

- [ ] [경계] 대상 — should ...

### 예외

- [ ] [예외] 대상 — should ...
```

---

## Step 6: AC 커버리지 검증 (자동)

GitHub 이슈의 Acceptance Criteria 항목을 하나씩 나열하고, 각 AC를 커버하는 시나리오를 매핑한다.

출력 형식:

```
## AC 커버리지 검증

| AC | 매핑된 시나리오 | 상태 |
|----|---------------|------|
| Enter/콤마로 태그 추가 | [정상] TagInput — should add tag... | ✅ |
| 즉시 PATCH 요청 | — | ❌ 누락 |
```

- **❌가 하나라도 있으면** 해당 AC를 커버하는 시나리오를 추가한 뒤 Step 5로 돌아가 기록한다.
- 모든 AC가 ✅일 때만 다음 단계로 넘어간다.

---

## Step 7: 시나리오 검토/승인

도출된 시나리오를 개발자에게 보여준다.

검증 항목:

- AC 커버리지 검증 테이블이 모두 ✅인가?
- 빠진 경계/예외 케이스가 없는가?
- 시나리오가 너무 세분화되거나 겹치지 않는가?

**승인 전까지 완료로 처리하지 않는다.**
개발자가 수정 요청하면 반영 후 다시 보여준다.

---

## 완료 보고

```
Test Scenarios 완료: Issue #{N}

시그니처: {타입 N개, 함수 N개, Props N개}
시나리오: 정상 {N}건, 경계 {N}건, 예외 {N}건 (총 {N}건)
파일: docs/features/tag/issue-{N}.md
```
