# Issues: 태그 기능

> **기준 문서:** `prd-tag-feature.md` · `adr-tag-feature.md` · `test-unit-tag-feature.md` · `test-e2e-tag-feature.md`
> **분류:** `[FEAT]` 구현 · `[FIX]` 버그·미구현 스펙 · `[TEST]` 테스트 · `[REFACTOR]` 개선

---

## [FEAT-01] TagInput: 기본 렌더링 구조

**설명**
`TagInput` 컴포넌트의 초기 렌더링을 구현한다. 전달받은 태그 배열을 배지로 표시하고, 태그 목록 끝에 `+` 버튼을 렌더링한다.

**완료 조건**
- `tags` prop으로 전달된 문자열 배열이 각각 배지(`<span>`)로 렌더링된다
- `tags`가 빈 배열이면 배지 없이 `+` 버튼만 렌더링된다
- `+` 버튼이 태그 목록 끝에 항상 표시된다
- 컴포넌트는 `{ tags: string[], onChange: (tags: string[]) => void }` Props만 가진다

**Given / When / Then**

> **시나리오 1 — 태그 배열이 있을 때**
> - **Given:** `tags={['react', 'typescript']}`를 전달받은 `TagInput`이 렌더링되어 있다
> - **When:** 컴포넌트가 마운트된다
> - **Then:** `react`, `typescript` 텍스트가 각각 배지로 화면에 표시된다

> **시나리오 2 — 태그 배열이 비어있을 때**
> - **Given:** `tags={[]}`를 전달받은 `TagInput`이 렌더링되어 있다
> - **When:** 컴포넌트가 마운트된다
> - **Then:** 배지는 없고 `+` 버튼 하나만 표시된다

**참조:** T-U-01, T-U-02, T-U-03 · PRD §3.2

---

## [FEAT-02] TagInput: 태그 추가 인터랙션

**설명**
`+` 버튼을 통해 새 태그를 인라인으로 추가하는 인터랙션을 구현한다. Enter 확정 / Esc 취소 / Blur 확정 / 빈 값 취소 동작을 포함한다.

**완료 조건**
- `+` 버튼 클릭 시 인라인 입력 필드(placeholder: `태그 입력`)가 나타나고 `+` 버튼은 사라진다
- 입력 필드에 포커스가 자동으로 이동한다(`autoFocus`)
- `Enter` 키 입력 시 `onChange(newTags)` 콜백이 호출되고 입력 필드가 닫힌다
- `Esc` 키 입력 시 태그가 추가되지 않고 입력 필드가 닫힌다
- 포커스 이탈(blur) 시 Enter와 동일하게 태그가 확정된다
- 빈 문자열(또는 공백만)로 Enter/blur 시 취소 처리되고 `onChange`는 호출되지 않는다

**Given / When / Then**

> **시나리오 1 — 정상 추가**
> - **Given:** `tags={['기존태그']}`인 `TagInput`이 렌더링되어 있다
> - **When:** `+` 버튼을 클릭하고, `신규태그`를 입력한 뒤 `Enter`를 누른다
> - **Then:** `onChange(['기존태그', '신규태그'])`가 호출된다

> **시나리오 2 — Esc 취소**
> - **Given:** `TagInput`이 렌더링되어 있고 `+`를 클릭해 입력 중이다
> - **When:** 텍스트를 입력하고 `Esc`를 누른다
> - **Then:** `onChange`가 호출되지 않고 `+` 버튼이 다시 표시된다

> **시나리오 3 — 빈 값 Enter**
> - **Given:** 입력 필드가 열려있고 아무것도 입력하지 않았다
> - **When:** `Enter`를 누른다
> - **Then:** `onChange`가 호출되지 않고 필드가 닫힌다

**참조:** T-U-04, T-U-05, T-U-06, T-U-07, T-U-09 · PRD US-01

---

## [FEAT-03] TagInput: 태그 편집 인터랙션

**설명**
기존 태그 배지를 클릭하면 인라인 편집 모드로 전환된다. 기존 값이 미리 채워지고, Enter/blur로 확정, Esc로 원본 유지 취소가 동작한다.

**완료 조건**
- 태그 배지 클릭 시 해당 배지가 입력 필드로 전환되고, 기존 태그 텍스트가 입력 필드에 채워진다
- 입력 필드에 포커스가 자동으로 이동한다
- 값을 수정하고 `Enter`를 누르면 `onChange`가 수정된 배열로 호출된다
- `Esc` 또는 빈 값으로 확정 시 `onChange`가 호출되지 않고 원래 값이 유지된다
- 편집 중인 태그 배지를 클릭해도 `isAdding` 상태가 초기화된다 (두 모드 동시 활성화 방지)

**Given / When / Then**

> **시나리오 1 — 편집 후 Enter 확정**
> - **Given:** `tags={['react', 'vue']}`인 `TagInput`이 있고, `vue` 배지가 표시되어 있다
> - **When:** `vue` 배지를 클릭해 편집 모드로 진입하고, 값을 `svelte`로 변경 후 `Enter`를 누른다
> - **Then:** `onChange(['react', 'svelte'])`가 호출된다

> **시나리오 2 — Esc 취소 (원본 유지)**
> - **Given:** `tags={['react']}`인 `TagInput`이 있고, `react` 배지가 표시되어 있다
> - **When:** `react`를 클릭하고, `different`로 바꾼 뒤 `Esc`를 누른다
> - **Then:** `onChange`가 호출되지 않고 `react` 배지가 그대로 표시된다

> **시나리오 3 — 편집 모드 진입 시 값 미리 채움**
> - **Given:** `tags={['typescript']}`인 `TagInput`이 있다
> - **When:** `typescript` 배지를 클릭한다
> - **Then:** 입력 필드에 `typescript`가 미리 채워져 있다

**참조:** T-U-10, T-U-11, T-U-12, T-U-13 · PRD US-02

---

## [FEAT-04] TagInput: 태그 삭제 인터랙션

**설명**
각 태그 배지의 `×` 버튼으로 태그를 즉시 삭제한다. `×` 버튼 클릭은 배지 클릭(편집 모드 진입)으로 전파되지 않아야 하며, 편집 중인 태그 삭제 시 편집 상태도 함께 초기화된다.

**완료 조건**
- 각 태그 배지에 `×` 버튼이 표시된다
- `×` 클릭 시 해당 태그가 제거된 배열로 `onChange`가 호출된다
- `×` 클릭 이벤트가 부모 배지로 전파되지 않는다 (`e.stopPropagation()`)
- 편집 중인 태그의 `×`를 클릭하면 편집 상태(`editingIndex`, `inputValue`)가 초기화된다

**Given / When / Then**

> **시나리오 1 — 정상 삭제**
> - **Given:** `tags={['react', 'vue']}`인 `TagInput`이 있다
> - **When:** `react` 배지의 `×` 버튼을 클릭한다
> - **Then:** `onChange(['vue'])`가 호출된다

> **시나리오 2 — 이벤트 전파 차단**
> - **Given:** `tags={['react']}`인 `TagInput`이 있다
> - **When:** `×` 버튼을 클릭한다
> - **Then:** 편집 입력 필드가 열리지 않는다 (배지 클릭 핸들러가 실행되지 않음)

> **시나리오 3 — 편집 중인 태그 삭제**
> - **Given:** `tags={['react']}`인 `TagInput`이 있고, `react` 배지를 클릭해 편집 모드 상태이다
> - **When:** 편집 중인 배지의 `×` 버튼을 클릭한다
> - **Then:** 태그가 삭제되고 편집 입력 필드가 닫히며 `+` 버튼이 다시 표시된다

**참조:** T-U-15, T-U-16, T-U-17 · PRD US-03

---

## [FEAT-05] TagInput: 중복 태그 방지

**설명**
추가 또는 편집 시 이미 존재하는 태그 값을 입력하면 Toast 에러를 표시하고 입력 필드를 유지한다. 편집 중에는 자기 자신(같은 인덱스)은 중복으로 간주하지 않는다.

**완료 조건**
- 추가 시 기존 태그와 동일한 값을 입력하면 `toast.error('이미 존재하는 태그입니다.')`가 호출된다
- 편집 시 자신 외의 다른 태그와 동일한 값을 입력하면 Toast 에러가 호출된다
- 중복 감지 시 `onChange`는 호출되지 않는다
- 중복 감지 시 입력 필드가 닫히지 않고 유지된다 (재입력 기회 제공)
- 중복 검사는 대소문자를 구분한다 (`"React"` ≠ `"react"`)

**Given / When / Then**

> **시나리오 1 — 추가 중 중복**
> - **Given:** `tags={['react']}`인 `TagInput`이 있고 `+` 버튼을 클릭해 입력 중이다
> - **When:** `react`를 입력하고 `Enter`를 누른다
> - **Then:** `toast.error('이미 존재하는 태그입니다.')`가 호출되고, `onChange`는 호출되지 않으며, 입력 필드가 그대로 남아있다

> **시나리오 2 — 편집 중 중복**
> - **Given:** `tags={['react', 'vue']}`인 `TagInput`이 있고 `vue` 배지를 클릭해 편집 중이다
> - **When:** `react`로 값을 변경하고 `Enter`를 누른다
> - **Then:** `toast.error('이미 존재하는 태그입니다.')`가 호출되고 `vue` 배지가 그대로 유지된다

**참조:** T-U-08, T-U-14 · SC-04 · PRD US-04 · ADR-001-E

---

## [FEAT-06] NoteItem: 태그 배지 목록 표시

**설명**
`NoteItem` 노트 카드에서 `note.tags` 배열을 배지로 표시한다. 태그가 없으면 배지 영역 자체를 렌더링하지 않는다.

**완료 조건**
- `note.tags`가 1개 이상이면 본문 미리보기 아래에 태그 배지가 표시된다
- `note.tags`가 빈 배열이면 태그 영역(`data-testid="tag-list"`)이 DOM에 렌더링되지 않는다
- 각 태그는 개별 배지로 구분되어 표시된다

**Given / When / Then**

> **시나리오 1 — 태그가 있는 노트**
> - **Given:** `tags: ['react', 'typescript']`인 노트 데이터가 존재한다
> - **When:** 노트 목록이 렌더링된다
> - **Then:** 해당 노트 카드에 `react`, `typescript` 배지가 표시된다

> **시나리오 2 — 태그가 없는 노트**
> - **Given:** `tags: []`인 노트 데이터가 존재한다
> - **When:** 노트 목록이 렌더링된다
> - **Then:** 해당 노트 카드에 태그 배지 영역이 렌더링되지 않는다

**참조:** T-U-02, T-U-03 · SC-06 · PRD US-05 · ADR-001-D

---

## [FEAT-07] NotesContext: 태그 포함 노트 저장

**설명**
`addNote`, `editNote` 함수가 `tags: string[]`를 파라미터로 받아 서버에 전달하도록 한다. 태그는 노트 저장 시점에 한 번에 영속화된다.

**완료 조건**
- `addNote(title, content, tags)` 시그니처에 `tags` 파라미터가 추가된다
- `addNote` 호출 시 `api.createNote`에 `tags`가 포함된 payload가 전달된다
- `editNote(id, updates)` 호출 시 `updates.tags`가 `api.updateNote`에 전달된다
- `NotesContextType` 인터페이스의 `addNote` 타입 정의가 업데이트된다
- 태그 변경은 `저장` 버튼 클릭 시에만 서버에 반영된다 (즉시 PATCH 없음)

**Given / When / Then**

> **시나리오 1 — 태그 포함 노트 생성**
> - **Given:** `NotesProvider`가 마운트되어 있고 API가 모킹되어 있다
> - **When:** `addNote('제목', '내용', ['react', 'ts'])`를 호출한다
> - **Then:** `api.createNote`가 `{ title: '제목', content: '내용', tags: ['react', 'ts'] }`를 포함한 payload로 호출된다

> **시나리오 2 — 태그 포함 노트 수정**
> - **Given:** ID `'1'`인 노트가 존재하고 API가 모킹되어 있다
> - **When:** `editNote('1', { tags: ['vue'] })`를 호출한다
> - **Then:** `api.updateNote('1', { tags: ['vue'] })`가 호출된다

> **시나리오 3 — 취소 시 서버 미반영**
> - **Given:** 태그가 있는 노트를 편집 중이고 태그를 추가했다
> - **When:** `저장` 대신 `취소` 버튼을 클릭한다
> - **Then:** 서버의 해당 노트 `tags` 필드가 변경되지 않는다

**참조:** T-U-21, T-U-22 · SC-01-서버, SC-05 · ADR-001-C

---

## [FIX-01] TagInput: 태그 최대 길이 10자 검증 미구현

**설명**
PRD §3.1에 명시된 태그 최대 길이 10자 제한이 현재 `TagInput.tsx`에 구현되어 있지 않다. 10자를 초과하는 태그를 입력해도 아무런 검증 없이 추가된다.

**완료 조건**
- 11자 이상의 태그 값을 `Enter` 또는 blur로 확정하면 `onChange`가 호출되지 않는다
- 길이 초과 시 Toast 에러 또는 인라인 피드백이 표시된다 (메시지: `태그는 최대 10자까지 입력 가능합니다.`)
- 입력 필드는 닫히지 않고 유지된다 (재입력 기회 제공)
- 편집 모드에서도 동일한 검증이 적용된다

**Given / When / Then**

> **시나리오 1 — 추가 시 초과**
> - **Given:** `TagInput`이 렌더링되어 있고 `+` 버튼을 클릭한 상태이다
> - **When:** 11자 이상의 문자열(`열한글자초과태그값`)을 입력하고 `Enter`를 누른다
> - **Then:** `onChange`가 호출되지 않고, 피드백 메시지가 표시되며, 입력 필드가 유지된다

> **시나리오 2 — 편집 시 초과**
> - **Given:** 기존 태그 배지를 클릭해 편집 모드에 진입했다
> - **When:** 11자 이상으로 값을 변경하고 `Enter`를 누른다
> - **Then:** `onChange`가 호출되지 않고 피드백이 표시된다

**참조:** T-U-미구현-01 · PRD §3.1

---

## [TEST-01] TagInput 단위 테스트 작성

**설명**
`src/components/__tests__/TagInput.test.tsx` 파일을 생성하고 `TagInput` 컴포넌트의 단위 테스트 17케이스를 작성한다. `react-hot-toast`는 모킹하여 사용한다.

**완료 조건**
- 테스트 파일이 `src/components/__tests__/TagInput.test.tsx`에 존재한다
- `pnpm test` 실행 시 아래 17개 케이스가 모두 통과한다
- `react-hot-toast`가 `vi.mock`으로 모킹되어 있다
- `setup()` 헬퍼 함수가 정의되어 코드 중복이 제거되어 있다

**테스트 케이스 목록**

| ID | 설명 | Given / When / Then 요약 |
|----|------|--------------------------|
| T-U-01 | `+` 버튼 초기 렌더링 | tags=[] → `+` 버튼 존재 |
| T-U-02 | 태그 배열 배지 렌더링 | tags=['a','b'] → 두 텍스트 존재 |
| T-U-03 | 빈 배열 배지 없음 | tags=[] → listitem 0개 |
| T-U-04 | `+` 클릭 → 입력 필드 표시 | `+` 클릭 → placeholder 등장 |
| T-U-05 | Enter → 태그 추가 | 입력 후 Enter → onChange 호출 |
| T-U-06 | Escape → 취소 | 입력 중 Esc → onChange 미호출 |
| T-U-07 | 빈 값 Enter → 취소 | 빈 상태 Enter → onChange 미호출 |
| T-U-08 | 중복 추가 → Toast | 중복 Enter → toast.error 호출, 필드 유지 |
| T-U-09 | blur → 태그 확정 | 입력 후 tab → onChange 호출 |
| T-U-10 | 배지 클릭 → 편집 모드 | 배지 클릭 → input 등장 |
| T-U-11 | 편집 모드 기존 값 채움 | 배지 클릭 → getByDisplayValue 일치 |
| T-U-12 | 편집 Enter → 수정 확정 | 값 변경 후 Enter → onChange 수정배열 |
| T-U-13 | 편집 Esc → 원본 유지 | 값 변경 후 Esc → onChange 미호출 |
| T-U-14 | 편집 중 중복 → Toast | 다른 태그값 입력 Enter → toast.error |
| T-U-15 | `×` 클릭 → 태그 삭제 | × 클릭 → onChange 필터 배열 |
| T-U-16 | `×` stopPropagation | × 클릭 → 편집 input 미등장 |
| T-U-17 | 편집 중 태그 × → 상태 초기화 | 편집 중 × → `+` 버튼 재등장 |

**참조:** test-unit-tag-feature.md §1

---

## [TEST-02] Tag 공용 컴포넌트 단위 테스트 작성

**설명**
`src/components/shared/__tests__/Tag.test.tsx` 파일을 생성하고 `Tag` 컴포넌트의 단위 테스트 3케이스(+색상 6변형)를 작성한다.

**완료 조건**
- 테스트 파일이 `src/components/shared/__tests__/Tag.test.tsx`에 존재한다
- `pnpm test` 실행 시 아래 케이스가 모두 통과한다

**Given / When / Then**

> **T-U-18 — label 렌더링**
> - **Given:** `<Tag label="typescript" />`가 렌더링된다
> - **When:** DOM을 확인한다
> - **Then:** `typescript` 텍스트가 존재한다

> **T-U-19 — 6색 CSS 클래스 (파라미터화)**
> - **Given:** `<Tag label="test" color={color} />`가 각 색상으로 렌더링된다 (indigo/violet/teal/amber/rose/slate)
> - **When:** DOM을 확인한다
> - **Then:** `tag-{color}` 클래스가 요소에 적용되어 있다

> **T-U-20 — 기본 color=indigo**
> - **Given:** `<Tag label="test" />`가 color prop 없이 렌더링된다
> - **When:** DOM을 확인한다
> - **Then:** `tag-indigo` 클래스가 적용되어 있다

**참조:** test-unit-tag-feature.md §2

---

## [TEST-03] NotesContext 태그 전달 단위 테스트 작성

**설명**
`src/context/__tests__/NotesContext.test.tsx` 파일을 생성하고 `addNote` / `editNote` 함수가 태그를 API에 올바르게 전달하는지 검증하는 단위 테스트 2케이스를 작성한다.

**완료 조건**
- 테스트 파일이 `src/context/__tests__/NotesContext.test.tsx`에 존재한다
- `api/notes` 모듈이 `vi.mock`으로 모킹되어 있다
- `pnpm test` 실행 시 아래 케이스가 모두 통과한다

**Given / When / Then**

> **T-U-21 — addNote에 tags 전달**
> - **Given:** `api.createNote`가 모킹되어 있고, `NotesProvider` 내에서 `useNotes`를 사용한다
> - **When:** `addNote('제목', '내용', ['react'])`를 호출한다
> - **Then:** `api.createNote`가 `{ tags: ['react'] }`를 포함하는 payload로 호출된다

> **T-U-22 — editNote에 tags 전달**
> - **Given:** `api.updateNote`가 모킹되어 있다
> - **When:** `editNote('1', { tags: ['vue'] })`를 호출한다
> - **Then:** `api.updateNote('1', { tags: ['vue'] })`가 호출된다

**참조:** test-unit-tag-feature.md §3

---

## [TEST-04] E2E 테스트 환경 구성 (Playwright)

**설명**
Playwright를 설치하고 태그 기능 E2E 테스트 실행을 위한 환경을 구성한다. JSON Server와 Vite 개발 서버가 별도로 기동되는 webServer 설정을 포함한다.

**완료 조건**
- `pnpm add -D @playwright/test` 및 `pnpm exec playwright install chromium`이 완료된다
- `playwright.config.ts`가 프로젝트 루트에 생성된다
  - `testDir: './e2e'`
  - `webServer` 2개: JSON Server (3001), Vite (5173)
- `package.json`에 `"dev:vite": "vite"` 스크립트가 추가된다 (JSON Server 없이 Vite만 실행)
- `e2e/fixtures/db.ts`가 생성되어 `cleanDb` 픽스처가 정의된다
- `pnpm exec playwright test` 명령이 에러 없이 실행된다 (테스트 파일 없어도 0 passed로 종료)

**Given / When / Then**

> **시나리오 — 환경 구성 검증**
> - **Given:** 의존성 설치와 설정 파일 작성이 완료되어 있다
> - **When:** `pnpm exec playwright test --list`를 실행한다
> - **Then:** 에러 없이 명령이 종료된다

**참조:** test-e2e-tag-feature.md §사전 조건 · §Playwright 설치 및 설정

---

## [TEST-05] 태그 기능 E2E 시나리오 테스트 작성

**설명**
`e2e/tag-feature.spec.ts` 파일에 태그 기능의 전체 사용자 플로우를 검증하는 E2E 테스트 13케이스를 작성한다. 각 테스트는 `beforeEach`에서 `db.json`을 `cleanDb`로 초기화하여 격리 실행한다.

**완료 조건**
- `e2e/tag-feature.spec.ts` 파일이 존재한다
- `test.beforeEach`에서 `db.json`을 `cleanDb`로 리셋하는 코드가 있다
- `pnpm exec playwright test` 실행 시 아래 13케이스가 모두 통과한다

**시나리오 목록**

| ID | 시나리오 | PRD | Given / When / Then 요약 |
|----|---------|-----|--------------------------|
| SC-01 | 새 노트 생성 시 태그 목록 카드 표시 | US-01, US-05 | 노트 생성 + 태그 추가 → 목록 카드에 배지 표시 |
| SC-01-서버 | 태그 서버 영속화 | US-01 | 저장 후 GET /notes → tags 포함 확인 |
| SC-02 | 기존 태그 편집 후 저장 | US-02 | 편집 → Enter → 저장 → 변경된 태그 표시 |
| SC-03 | 태그 삭제 후 저장 | US-03 | × 클릭 → 저장 → 카드에서 사라짐 |
| SC-03-이벤트 | × 클릭 stopPropagation | US-03 | × 클릭 → 편집 input 미등장 |
| SC-04 | 중복 추가 → Toast + 필드 유지 | US-04 | 중복 Enter → Toast 3초 노출, 필드 유지 |
| SC-04-편집 | 편집 중 중복 → Toast | US-04 | 편집 중 중복 Enter → Toast, 원본 유지 |
| SC-05 | 취소 시 서버 미반영 | US-02 | 태그 추가 → 취소 → GET /notes 미변경 |
| SC-05-재진입 | 취소 후 노트 재선택 시 원본 복원 | US-02 | 취소 → 노트 전환 → 재선택 → 원본 태그 표시 |
| SC-06 | 태그 있는 노트 카드 배지 표시 | US-05 | 초기 렌더링 → 카드에 배지 표시 |
| SC-06-빈태그 | 태그 없는 노트 배지 영역 미렌더링 | US-05 | 초기 렌더링 → tag-list 미노출 |
| SC-07 | 노트 전환 시 편집 상태 초기화 | ADR-001-B | 입력 중 → 노트 전환 → 재선택 → `+` 버튼 |
| SC-08 | Esc로 입력 취소 | US-01 | `+` 클릭 → Esc → 필드 닫힘 |

**참조:** test-e2e-tag-feature.md · TEST-04 (선행 완료 필요)

---

## [REFACTOR-01] NoteItem: 인라인 태그 배지 → shared/Tag 마이그레이션

**설명**
`NoteItem.tsx`의 인라인 태그 배지(`<span className="px-1.5 py-0.5 rounded-full ...">`)를 `src/components/shared/Tag` 컴포넌트로 교체한다. 디자인 시스템 CSS 클래스(`.tag .tag-{color}`)가 적용된다.

**완료 조건**
- `NoteItem.tsx`에서 `shared/Tag`를 import하여 사용한다
- 인라인 태그 스타일 클래스가 제거된다
- 기존 시각적 출력이 동일하게 유지된다 (색상 기본값 `indigo` 적용)
- `pnpm run build` 타입 검사가 통과한다

**Given / When / Then**

> **시나리오 — 리팩토링 후 동작 유지**
> - **Given:** 리팩토링이 완료된 상태이다
> - **When:** `tags: ['react', 'typescript']`인 노트 카드가 렌더링된다
> - **Then:** 두 태그가 `.tag.tag-indigo` 클래스를 가진 배지로 표시된다 (기존과 시각적으로 동일)

**참조:** ADR-001-D · FEAT-06

---

## [REFACTOR-02] TagInput: 내부 배지 → shared/Tag 클래스 마이그레이션

**설명**
`TagInput.tsx` 내부의 태그 배지 인라인 Tailwind 스타일(`px-2 py-0.5 rounded-full bg-foreground/10`)을 디자인 시스템의 `.tag .tag-{color}` 클래스로 교체한다.

**완료 조건**
- `TagInput.tsx` 내 태그 배지의 인라인 Tailwind 클래스가 `.tag .tag-indigo`(또는 다른 색상)로 교체된다
- 편집 중 배지는 `.tag-input` 클래스가 적용된다
- 기존 태그 추가·편집·삭제 동작이 변경되지 않는다
- `pnpm run build` 타입 검사가 통과한다
- T-U-01 ~ T-U-17 단위 테스트가 모두 통과한다

**Given / When / Then**

> **시나리오 — 리팩토링 후 동작 유지**
> - **Given:** `TagInput` 리팩토링이 완료된 상태이다
> - **When:** 태그 추가 플로우를 수행한다 (`+` 클릭 → 입력 → Enter)
> - **Then:** 기존 17개 단위 테스트가 모두 통과하고, 배지가 `.tag.tag-indigo` 클래스로 렌더링된다

**참조:** ADR-001-D · TEST-01

---

## 이슈 우선순위 및 의존 관계

```
[FEAT-01] ──▶ [FEAT-02] ──▶ [FEAT-03]
                          ──▶ [FEAT-04]
                          ──▶ [FEAT-05]
[FEAT-06] ──▶ [REFACTOR-01]
[FEAT-07] (NotesContext) ──▶ 전체 E2E 전제

[FIX-01] (독립)

[TEST-01] ←── [FEAT-01~05] 완료 후 (Red 단계: 구현 전 먼저 작성)
[TEST-02] ←── shared/Tag 컴포넌트 존재
[TEST-03] ←── [FEAT-07] 완료 후
[TEST-04] (환경 구성, 독립)
[TEST-05] ←── [TEST-04] + 전체 FEAT 완료

[REFACTOR-01] ←── [FEAT-06] + shared/Tag 컴포넌트 존재
[REFACTOR-02] ←── [TEST-01] 통과 + shared/Tag 클래스 확인
```

| 이슈 | 유형 | 우선순위 | 선행 이슈 |
|------|------|---------|----------|
| FEAT-01 | 구현 | P0 | — |
| FEAT-02 | 구현 | P0 | FEAT-01 |
| FEAT-03 | 구현 | P0 | FEAT-01 |
| FEAT-04 | 구현 | P0 | FEAT-01 |
| FEAT-05 | 구현 | P0 | FEAT-02, FEAT-03 |
| FEAT-06 | 구현 | P0 | — |
| FEAT-07 | 구현 | P0 | — |
| FIX-01 | 버그 | P1 | FEAT-02 |
| TEST-01 | 테스트 | P1 | FEAT-01~05 |
| TEST-02 | 테스트 | P1 | shared/Tag |
| TEST-03 | 테스트 | P1 | FEAT-07 |
| TEST-04 | 테스트 | P2 | — |
| TEST-05 | 테스트 | P2 | TEST-04 + 전체 FEAT |
| REFACTOR-01 | 개선 | P2 | FEAT-06 |
| REFACTOR-02 | 개선 | P2 | TEST-01 |
