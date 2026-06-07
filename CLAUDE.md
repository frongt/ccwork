# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

React 19 + TypeScript + Vite 기반의 **노트 앱 학습용 프로젝트**. 백엔드는 `json-server`가 `db.json`을 그대로 REST API로 노출하는 구조로, 실제 서버 구현 없이 프론트엔드 패턴 실습에 집중하기 위한 설계다.

`src/types/note.ts`에 `// ❌ tags 필드는 아직 없음 — 강의에서 추가할 것` 같은 주석이 남아 있다는 점에서, 강의/실습 진행 중 점진적으로 기능을 추가해 나가는 코드베이스임을 인지할 것.

## 자주 쓰는 명령어

| 명령어 | 동작 |
|--------|------|
| `npm run dev` | Vite 개발 서버(5173) + json-server(3001) 동시 실행 (`concurrently`) |
| `npm run server` | json-server만 단독 실행 |
| `npm run build` | `tsc`로 타입 체크 후 `vite build` |
| `npm run lint` | ESLint 검사 (`--fix` 포함) |
| `npm run format` | Prettier 일괄 포맷 |
| `npm test` | Vitest 1회 실행 |
| `npm run test:watch` | Vitest watch 모드 |

단일 테스트 실행: `npx vitest run path/to/file.test.tsx` 또는 `-t "테스트 이름"`.

## 아키텍처

### 데이터 흐름 (한 방향)

```
db.json  ←→  json-server(:3001)  ←→  src/api/notes.ts  ←→  NotesContext  ←→  컴포넌트
```

- **`src/api/notes.ts`**: `fetch` 기반 CRUD 함수만 export. `API_URL`이 하드코딩(`http://localhost:3001`)되어 있으므로 환경별 분리가 필요하면 이 파일을 손볼 것.
- **`src/context/NotesContext.tsx`**: 단일 Provider가 노트 목록 + loading/error 상태 + add/edit/remove 액션을 모두 보유. 모든 컴포넌트는 `useNotes()` 훅을 통해서만 접근한다. 상태 라이브러리(Redux, Zustand 등)는 의도적으로 도입하지 않음.
- **컴포넌트**: 자체 상태는 UI 임시 상태(폼 입력, 저장 중 플래그 등)만 가진다. 서버 동기 상태는 컨텍스트가 단독 소유.

### 컴포넌트 계층

`App.tsx`가 "어떤 노트가 선택됐는지 / 새 노트 작성 중인지"를 **로컬 state로** 관리하고, `Layout`에 sidebar/main 슬롯을 prop으로 주입하는 컴포지션 패턴. 라우터 없음 — 단일 페이지에서 selected/creating 상태로 화면을 분기한다.

```
App (selectedNoteId, isCreating 보유)
└── NotesProvider
    └── Layout (slot: sidebar, main)
        ├── NoteList → NoteItem
        └── NoteEditor
```

`NoteEditor`는 `selectedNoteId` 변경 시 `useEffect`로 폼을 동기화한다 (`eslint-disable react-hooks/exhaustive-deps`가 의도적으로 붙어 있음 — deps에 form state를 넣으면 무한 루프).

### 낙관적이지 않은 상태 갱신

`createNote`/`updateNote`/`deleteNote`는 모두 **서버 응답을 기다린 뒤** 로컬 상태를 갱신한다 (낙관적 업데이트 아님). 응답이 새 객체이므로 ID 기반 `map`/`filter`로 교체하는 방식.

## 코드 컨벤션

### 컴포넌트 구현 패턴

- **named export + `function` 선언**: `export function NoteEditor(...)`. 화살표 함수 컴포넌트나 `React.FC` 타입은 쓰지 않는다. (단 `App.tsx`만 `export default` — 엔트리이므로 예외)
- **Props 타입은 컴포넌트 바로 위에 `interface ComponentNameProps`로 선언**. `type` alias나 inline props는 쓰지 않는다.
- **파일명 = 컴포넌트명**: `NoteEditor.tsx` 안에 `NoteEditor` 1개. `src/components/` 아래 평탄하게 두고 서브폴더를 만들지 않는다.
- **컴포넌트는 자체 서버 상태를 갖지 않는다**: `useNotes()`로만 접근. 로컬 `useState`는 폼 입력값, `saving` 같은 UI 임시 상태 한정.
- **로딩/에러/빈 상태는 early return으로 먼저 처리**한 뒤 본 렌더링으로 내려간다 (`NoteList`, `NoteEditor` 참조).

### 상태 관리 방식

- **서버 상태는 `NotesContext` 단독 소유**. 컴포넌트는 `useNotes()`만 사용하고 직접 `api/notes`를 호출하지 않는다.
- **화면 분기 상태(`selectedNoteId`, `isCreating` 등)는 `App.tsx`까지 끌어올린다.** 형제 컴포넌트가 공유하는 상태는 컨텍스트가 아닌 가장 가까운 공통 부모에 둔다 (서버 상태가 아니므로 컨텍스트에 넣지 않음).
- **setState는 항상 prev 콜백 패턴**: `setNotes((prev) => prev.map(...))`. 직접 참조 (`setNotes([...notes, x])`)는 쓰지 않는다.
- **커스텀 훅에서 Provider 누락은 throw로 단언**: `if (!ctx) throw new Error('useX must be used within XProvider')`.

### API 호출 패턴

- **도메인별 파일로 분리**: `src/api/<domain>.ts`. 각 함수는 `async` + `Promise<T>` 명시.
- **응답 체크 1줄**: `if (!res.ok) throw new Error('Failed to <verb> <noun>');` — 에러 메시지는 영문 동사로.
- **타임스탬프(`createdAt`, `updatedAt`)는 API 레이어에서 주입**한다. 컴포넌트/컨텍스트가 직접 만들지 않는다. (json-server에 백엔드 로직이 없어 클라이언트가 채우는 구조)
- **import는 네임스페이스 형식**: `import * as api from '../api/notes'`. 컨텍스트가 `api.createNote(...)`처럼 호출.
- **컨텍스트가 응답을 받은 뒤 로컬 상태 갱신** (낙관적 업데이트 아님 — 위 "낙관적이지 않은 상태 갱신" 항목 참조).

### 네이밍 패턴

| 종류 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트/타입/인터페이스 | PascalCase | `NoteEditor`, `Note`, `NoteEditorProps` |
| 함수/변수 | camelCase | `fetchNotes`, `selectedNote` |
| 내부 핸들러 | `handleX` | `handleSave`, `handleSelectNote` |
| Props 콜백 | `onX` | `onSelect`, `onDone`, `onDelete` |
| boolean 상태 | `isX` 또는 진행형 | `isCreating`, `isSelected`, `loading`, `saving` |
| ID | `xxxId` (string) | `selectedNoteId`, `note.id` |
| API 함수 | `verb + Noun` (영문) | `fetchNotes`, `createNote`, `updateNote`, `deleteNote` |
| 컨텍스트 액션 | `verb + Noun` (영문, API와 동일) | `createNote`, `updateNote`, `deleteNote` |
| 사용자 노출 텍스트 | 한국어 | `'저장 중...'`, `'노트가 없습니다'` |

### ⚠️ 발견된 일관성 없는 패턴

코드를 수정할 때 의식하거나, 통일이 필요한 지점들:

1. **변이(mutation) 에러 처리가 호출부마다 다르다**
   - `NotesContext`의 `fetchNotes`는 에러를 `error` state에 저장.
   - `createNote/updateNote/deleteNote`는 에러를 throw로 위로 던지지만, **호출부마다 처리가 다름**:
     - `NoteEditor.handleSave`: `try/catch` + `alert()`로 사용자 알림
     - `NoteList`의 `deleteNote`: try/catch 없이 그대로 호출 → **삭제 실패 시 사용자에게 알림 없이 조용히 무시됨**
   - 변이 에러의 표준 처리(컨텍스트가 흡수 vs 호출부 책임)를 정해야 한다.

2. **`export default` vs named export 혼재**: `App.tsx`만 default. 의도된 예외이긴 하나, 신규 컴포넌트는 항상 named export를 쓸 것.

3. **타입 전용 import 미사용**: `import { Note } from '../types/note'` — TS 5+의 `import type { Note }`를 쓰지 않는다. 번들러가 자동으로 제거하지만 명시적이지 않음. (eslint 규칙 미설정으로 추정)

4. **`NoteEditor`의 폼 동기화 `useEffect` 의존성**: `eslint-disable react-hooks/exhaustive-deps`가 의도적으로 붙어 있다 (위 "컴포넌트 계층" 참조). 비슷한 폼 동기화 시에도 같은 패턴을 유지할 것.

## 스타일링

- **Tailwind CSS v4** + `@tailwindcss/vite` 플러그인. `tailwind.config.js`는 없다 (v4는 CSS 우선 설정).
- 색상 토큰(`bg-card`, `text-muted-foreground`, `border-border` 등)은 `src/index.css`에서 CSS 변수로 정의되어 있다. 새 색을 쓰지 말고 기존 토큰을 재사용할 것.
- 둥근 모서리(`rounded-xl`, `rounded-3xl`)와 부드러운 그림자가 일관된 디자인 언어다.

## 테스트

- Vitest + jsdom + Testing Library 구성. `vite.config.ts`의 `test` 블록 참조.
- `src/test-setup.ts`가 `@testing-library/jest-dom` 매처를 등록한다.
- 아직 테스트 파일이 없을 수 있다 — 신규 작성 시 컴포넌트 옆에 `*.test.tsx`로 두는 것이 자연스럽다.

## 주의사항

- **백엔드 부재**: `npm run dev`가 json-server를 함께 띄우므로, Vite만 단독 실행하면 API 호출이 전부 실패한다.
- **ID는 문자열**: json-server가 자동 생성하는 ID는 문자열이다. `Note.id: string` 타입을 유지할 것.
- **`db.json`은 실제 데이터 저장소**: 테스트/개발 중 변경 사항이 그대로 파일에 반영되므로, 시드 데이터를 보존하고 싶다면 별도 백업 후 작업.
