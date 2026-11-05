# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 목적

React 19 + TypeScript + Vite 기반 **노트 앱 실습 프로젝트** (강의/TDD 연습용). 노트의 목록/생성/수정/삭제(CRUD)를 제공하는 단일 페이지 앱이다. 백엔드는 `json-server`가 `db.json`을 REST API로 노출한다.

- `src/types/note.ts`에 "tags 필드는 아직 없음 — 강의에서 추가할 것"이라는 주석이 있다. 이후 태그 기능 추가가 계획되어 있으므로, 확장 시 `Note` 타입 → `api/notes.ts` → Context → 컴포넌트 순서로 반영한다.
- 테스트 인프라(vitest, Testing Library, jsdom)는 설정되어 있으나 아직 테스트 파일은 없다.

## 명령어

```bash
npm run dev          # Vite(5173) + json-server(3001) 동시 실행 (concurrently)
npm run server       # json-server만 실행 (db.json --watch)
npm run build        # tsc && vite build
npm run lint         # eslint . --fix  (자동 수정 포함)
npm run format       # prettier --write .
npm test             # vitest run (1회 실행)
npm run test:watch   # vitest watch
npx vitest run src/path/to.test.tsx            # 단일 테스트 파일
npx vitest run -t "테스트 이름"                  # 이름으로 필터
```

- 앱 동작 확인에는 API 서버(`http://localhost:3001/notes`)가 반드시 떠 있어야 한다. `npm run dev`는 둘 다 띄운다.
- `db.json`은 json-server가 런타임에 직접 수정한다(노트 추가/삭제 시 git diff 발생). 의도치 않은 데이터 변경을 커밋하지 않도록 주의.

## 아키텍처

데이터 흐름은 단방향 계층이다: `api/notes.ts`(fetch) → `NotesContext`(상태) → `components/*`(UI)

```
src/
├── main.tsx                  # 진입점 (StrictMode + App)
├── App.tsx                   # UI 선택 상태 소유: selectedNoteId, isCreating (Context 아님)
│   │                         #   └ NotesProvider로 감싸고 Layout에 sidebar/main 슬롯 주입
│   └── components/
│       ├── Layout.tsx        # 헤더("+ 새 노트") + 사이드바/메인 슬롯 레이아웃
│       ├── NoteList.tsx      # [sidebar] loading/error/empty 분기 후 NoteItem 렌더
│       │   └── NoteItem.tsx  #   카드 UI, 삭제 버튼은 stopPropagation
│       └── NoteEditor.tsx    # [main] 제목/내용 폼, 생성/수정 겸용
├── context/
│   └── NotesContext.tsx      # NotesProvider: notes/loading/error + createNote/updateNote/deleteNote
│                             #   · 마운트 시 fetchNotes로 초기 로딩
│                             #   · 서버 응답 후 로컬 상태 갱신 (낙관적 업데이트 없음)
│                             #   · useNotes()는 Provider 밖에서 호출 시 throw
├── api/
│   └── notes.ts              # fetch 래퍼, API_URL=http://localhost:3001 하드코딩
│                             #   · createdAt/updatedAt은 클라이언트에서 생성
│                             #   · !res.ok 이면 Error throw
└── types/
    └── note.ts               # Note 인터페이스 (id는 string, json-server가 생성)
```

## 구현 패턴 / 컨벤션

### 컴포넌트 구현 패턴
- 함수형 컴포넌트 + **named export** (`export function X`). 기본 export는 `App`만.
- props는 컴포넌트 바로 위에 `XxxProps` 인터페이스로 정의하고 파라미터에서 구조 분해.
- 데이터가 필요한 컴포넌트(`NoteList`, `NoteEditor`)는 `useNotes()`를 직접 호출. `NoteItem`/`Layout`은 props만 받는 순수 표현 컴포넌트.
- 레이아웃 컴포넌트는 `ReactNode` 슬롯 props(`sidebar`, `main`)로 자식을 받는다.
- 조건부 렌더링은 early return (`loading` → `error` → empty → 본문 순서).
- JSX 구획은 `{/* 제목 */}` 형태의 한국어 주석으로 나눈다.
- **NoteEditor 폼 동기화**: `selectedNoteId`/`isCreating` 변경 시 `useEffect`로 로컬 `title/content`를 리셋. 의존성에 `selectedNote`를 의도적으로 뺐기에 `eslint-disable-line react-hooks/exhaustive-deps`가 붙어 있다.

### 상태관리 방식
- 외부 라이브러리 없이 **React 내장 `useState` + Context**만 사용 (reducer, memo 계열 훅 없음).
- 서버 데이터(`notes/loading/error`) → `NotesContext`. UI 선택 상태(`selectedNoteId`, `isCreating`) → `App`의 `useState` 후 props drilling. 폼 입력(`title/content/saving`) → `NoteEditor` 로컬 `useState`.
- 변경 후에는 서버 응답으로 로컬 배열을 갱신(`[...prev, new]`, `map`, `filter`)하며, 재조회(refetch)는 하지 않는다.

### API 호출 패턴
- 리소스당 `api/<resource>.ts`에 `async` 함수 모음, 컴포넌트는 직접 `fetch`하지 않고 **Context 경유**로만 호출 (`import * as api`).
- 순서: `fetch` → `if (!res.ok) throw new Error('Failed to ...')` → `res.json()`. 삭제만 반환값 없음(`Promise<void>`).
- 수정은 `PATCH`(부분 갱신) + `updatedAt` 자동 갱신. 헤더는 `Content-Type: application/json`.
- 에러는 API → Context로 그대로 전파되고, 호출한 컴포넌트(`NoteEditor`, `NoteList`)가 `try/catch`에서 **`console.error`로만** 처리한다. `alert()`는 사용하지 않는다.
- CRUD 동사는 API·Context 모두 `create/update/delete`로 통일 (`add/edit/remove` 사용 금지).

### 네이밍 패턴
- 파일: 컴포넌트·Context는 `PascalCase.tsx`, API·타입은 `camelCase.ts`.
- Props 콜백은 `onXxx` (`onSelect`, `onDelete`, `onDone`, `onNewNote`), 이를 구현하는 핸들러는 `handleXxx` (`handleSave`, `handleSelectNote`).
- 불리언 상태는 `isXxx` (`isCreating`, `isSelected`), 단 `loading`/`saving`은 예외.
- 인터페이스는 `XxxProps`, `XxxContextType`. 타입 파일은 단수형(`note.ts`).
- **스타일링**: Tailwind CSS v4 (`@tailwindcss/vite` 플러그인) 유틸리티 클래스를 JSX에 직접 작성. `bg-card`, `text-muted-foreground`, `border-border`, `text-destructive` 등 시맨틱 색상 토큰은 `src/index.css`에서 정의된다. 버튼은 `cursor-pointer`, `hover:opacity-75` 패턴.
- **UI 문구는 한국어** (예: "새 노트", "저장 중...", "노트가 없습니다"). 새 문구도 한국어로 통일. 날짜는 `toLocaleDateString('ko-KR')`.
- **Prettier** (`.prettierrc`): 세미콜론, 작은따옴표, 2칸 들여쓰기, trailing comma `all`, printWidth 100.
- **ESLint** (flat config, `eslint.config.js`): `typescript-eslint` recommended + `react-hooks` + `react-refresh/only-export-components`(warn). 참고로 `NotesContext.tsx`는 Provider와 훅을 함께 export한다.

## 발견된 불일치 / 주의점

- **파일명 단/복수**: `api/notes.ts`(복수) vs `types/note.ts`(단수).
- **불리언 네이밍**: `isCreating`/`isSelected` vs `loading`/`saving`(접두어 없음).
- **비동기 스타일**: `NotesContext`의 초기 로딩은 `.then().catch().finally()`, 나머지는 `async/await`.
- **에러 처리**: 모두 `console.error`뿐이라 사용자에게는 실패가 보이지 않는다(저장/삭제 실패 시 UI 피드백 없음). 목록 로딩 실패만 `error` 상태로 화면에 표시. 삭제 확인창은 없다.
- **에러 언어 혼재**: API 에러 메시지는 영어(`Failed to fetch notes`)인데 UI는 한국어라 `오류: Failed to fetch notes`처럼 섞여 표시된다.
- **스타일링 혼재**: 기본은 Tailwind 클래스지만 `Layout`은 `style={{ fontFamily }}`, `style={{ height: 'calc(...)' }}` 인라인 스타일도 사용. 그림자(`shadow-[...]`)와 섹션 라벨 클래스 문자열이 여러 파일에 복붙되어 있다.
- **타입 import**: 타입에도 `import { Note }`를 쓰고 `import type`은 쓰지 않는다.
- **Context 값 비메모이제이션**: `value` 객체와 함수가 매 렌더 새로 생성된다 (`useCallback`/`useMemo` 없음).
- **취소 버튼**: `NoteEditor`의 취소는 `onDone`(`isCreating=false`)만 호출해, 수정 중 취소해도 입력값이 되돌려지지 않는다.
- **`updateNote`**: `Partial<Note>`라 `id`/`createdAt`도 덮어쓸 수 있다.

## 테스트 설정

`vite.config.ts`의 `test` 블록: `globals: true`, `environment: 'jsdom'`, `setupFiles: ./src/test-setup.ts`(`@testing-library/jest-dom` 로드). 컴포넌트 테스트에서 `useNotes`/`api` 모듈은 mock 하거나 `NotesProvider`로 감싸서 사용해야 한다 (`fetch`가 실제 `localhost:3001`을 호출함).
