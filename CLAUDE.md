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
│   └── NotesContext.tsx      # NotesProvider: notes/loading/error + addNote/editNote/removeNote
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
- 컴포넌트를 생성할 땐, export 하는 컴포넌트명과 파일명이 일치해야 한다.
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
- 에러는 API → Context로 그대로 전파되고, 호출한 컴포넌트(`NoteEditor`)가 `try/catch`에서 `alert`로 처리.

### 네이밍 패턴

- 파일: 컴포넌트·Context는 `PascalCase.tsx`, API·타입은 `camelCase.ts`.
- Props 콜백은 `onXxx` (`onSelect`, `onDelete`, `onDone`, `onNewNote`), 이를 구현하는 핸들러는 `handleXxx` (`handleSave`, `handleSelectNote`).
- 불리언 상태는 `isXxx` (`isCreating`, `isSelected`), 단 `loading`/`saving`은 예외.
- 인터페이스는 `XxxProps`, `XxxContextType`. 타입 파일은 단수형(`note.ts`).
- **스타일링**: Tailwind CSS v4 (`@tailwindcss/vite` 플러그인) 유틸리티 클래스를 JSX에 직접 작성. `bg-card`, `text-muted-foreground`, `border-border`, `text-destructive` 등 시맨틱 색상 토큰은 `src/index.css`에서 정의된다. 버튼은 `cursor-pointer`, `hover:opacity-75` 패턴.
- **UI 문구는 한국어** (예: "새 노트", "저장 중...", "노트가 없습니다"). 새 문구도 한국어로 통일. 날짜는 `toLocaleDateString('ko-KR')`.
- **Prettier** (`.prettierrc`): 세미콜론, 작은따옴표, 2칸 들여쓰기, trailing comma `all`, printWidth 100.
- **ESLint** (flat config, `eslint.config.js`): `typescript-eslint` recommended + `react-hooks` + `react-refresh/only-export-components`(warn). 참고로 `NotesContext.tsx`는 Provider와 훅을 함께 export한다.

## 디자인 시스템

**색, 타이포, 간격, 그림자, 컴포넌트 모양 등 모든 스타일 작업 전에 `docs/design-system/`을 먼저 참조한다.** 진입점은 `docs/design-system/README.md`이고, 반드시 `rules/do-and-dont.md`의 Do / Don't를 지킨다.

- 핵심 규칙: 구분선(1px 테두리) 금지 → 배경색 차이와 간격으로 구분, 순수 검정 금지, 액센트(`tertiary`)는 의도가 있는 액션에만, 폰트는 Inter(+Pretendard 폴백).
- 기존 코드(`src/index.css`, `components/*`)는 아직 새 디자인 시스템으로 마이그레이션되지 않았다. 차이는 `docs/design-system/migration.md`를 본다. 스타일을 수정하는 파일은 디자인 시스템 기준에 맞춘다.

## 테스트 설정

`vite.config.ts`의 `test` 블록: `globals: true`, `environment: 'jsdom'`, `setupFiles: ./src/test-setup.ts`(`@testing-library/jest-dom` 로드). 컴포넌트 테스트에서 `useNotes`/`api` 모듈은 mock 하거나 `NotesProvider`로 감싸서 사용해야 한다 (`fetch`가 실제 `localhost:3001`을 호출함).

## git commit / push 설정

git 훅에서 오류가 났을 경우 직접 수정해서 commit 또는 push를 진행하지 않는다. 오류가 났을 경우엔 어느 파일에서 어떤 오류가 났는지 정보를 제공한다.

### 커밋 메시지 규칙 (commitlint)

- 형식: `type: 제목`. type은 `feat`/`fix`/`docs`/`chore`/`test`/`refactor`/`style`/`ci` 중에서만 허용(그 외 불가).
- 제목(헤더 첫 줄 전체)은 50자 이하, 영문은 소문자. 본문은 최소 10자 이상.
