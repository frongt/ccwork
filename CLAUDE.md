# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

React 19 + TypeScript + Vite 기반 노트 CRUD 앱. 강의/실습용 프로젝트로, 단계적으로 기능을 추가해 나가는 구조.

## 명령어

```bash
npm run dev          # 프론트(5173) + JSON Server(3001) 동시 실행
npm run server       # JSON Server 단독 실행
npm run build        # tsc + vite build
npm run lint         # eslint --fix
npm run format       # prettier --write
npm test             # vitest run (단일 실행)
npm run test:watch   # vitest (watch 모드)
```

## 기술 스택

- **React 19** — SPA, StrictMode
- **Vite 6** — 번들러, dev server (port 5173)
- **Tailwind CSS v4** — `@tailwindcss/vite` 플러그인, `@theme` 디렉티브로 커스텀 토큰 정의
- **json-server** — REST API 모킹 (port 3001), `db.json`이 데이터 소스
- **Vitest** — jsdom 환경, `@testing-library/react` + `jest-dom`
- **TypeScript** — strict 모드, `noUnusedLocals`, `noUnusedParameters`

## 아키텍처

```
App (selectedNoteId, isCreating 상태 관리)
└─ NotesProvider (Context)
   ├─ Layout (슬롯: sidebar, main)
   │  ├─ NoteList → NoteItem[]
   │  └─ NoteEditor
```

## 구현 패턴

### 컴포넌트

- **named export 함수 컴포넌트** — `export function NoteList() {}` (default export는 App만)
- **Props 인터페이스를 컴포넌트 바로 위에 선언** — 파일 내 인라인, 별도 파일 분리 안 함
- **슬롯 패턴** — Layout이 `sidebar: ReactNode`, `main: ReactNode`를 받아 배치
- **조건부 렌더링** — early return으로 loading/error/empty 상태 처리 후 본 UI 렌더링
- **이벤트 버블링 차단** — 중첩 클릭 시 `e.stopPropagation()` 사용 (NoteItem 삭제 버튼)

### 상태 관리

- **2계층 구조**: App 로컬 state (UI 제어) + Context (도메인 데이터)
  - `App`: `selectedNoteId`, `isCreating` — 어떤 화면을 보여줄지 결정
  - `NotesContext`: `notes[]`, `loading`, `error` + CRUD 함수 — 데이터 소유
- **Context 패턴**: Provider + `useNotes()` 커스텀 훅, Provider 밖 호출 시 throw
- **API 응답 후 state 동기화**: 낙관적 업데이트 없음, 서버 응답을 받은 뒤 `setNotes()`
- **폼 동기화**: `useEffect`로 `selectedNoteId` 변경 시 에디터 폼 값 리셋

### API 호출

- **`src/api/notes.ts`에 도메인별 함수로 분리** — `fetchNotes`, `createNote`, `updateNote`, `deleteNote`
- **순수 fetch** — 외부 라이브러리 없이 native fetch 사용
- **에러 처리**: `!res.ok` 체크 후 `throw new Error()`
- **타임스탬프 클라이언트 생성**: `createdAt`, `updatedAt`을 API 호출 시 `new Date().toISOString()`으로 생성
- **타입 활용**: 생성 시 `Omit<Note, 'id' | 'createdAt' | 'updatedAt'>`, 수정 시 `Partial<Note>`

### 네이밍 규칙

- **파일**: PascalCase 컴포넌트 (`NoteItem.tsx`), camelCase 유틸/API (`notes.ts`), camelCase 타입 파일 (`note.ts`)
- **컴포넌트**: PascalCase (`NoteEditor`, `NoteList`)
- **함수/변수**: camelCase (`handleSave`, `selectedNoteId`)
- **이벤트 핸들러**: `handle` + 동작 (`handleSave`, `handleNewNote`, `handleDone`)
- **콜백 props**: `on` + 동작 (`onSelect`, `onDelete`, `onDone`, `onNewNote`)
- **Context 훅**: `use` + 도메인 (`useNotes`)
- **API 함수**: 동사 + 도메인 (`fetchNotes`, `createNote`, `updateNote`, `deleteNote`)
- **boolean state**: `is` + 상태 (`isCreating`, `isSelected`), `loading`, `saving`

## 스타일링 컨벤션

- Tailwind v4의 `@theme` 블록으로 디자인 토큰 정의 (`index.css`)
- 시맨틱 토큰: `background`, `card`, `foreground`, `muted`, `muted-foreground`, `border`, `destructive`
- 폰트: Pretendard Variable (본문), Boogaloo (로고)
- 라운딩: `rounded-2xl`~`rounded-3xl` 카드 스타일
- 선택 상태: `border-foreground` + 강조 shadow, 비선택: `border-border` + 약한 hover shadow
- 버튼: primary(`bg-foreground text-card`), secondary(`bg-muted text-muted-foreground`)

## 커밋 컨벤션

- Conventional Commits 형식: `type(scope): subject`
- type: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- 제목 72자 이내, 본문 필수 (최소 20자)
- husky + commitlint로 자동 검사

## 주의사항

- `db.json`은 json-server의 실제 데이터 파일 — 서버 실행 중 직접 수정 시 충돌 가능
- `Note` 타입에 `tags` 필드는 아직 없음 (강의에서 추가 예정)
- API URL이 하드코딩되어 있음 (`http://localhost:3001`)
- 테스트 셋업: `src/test-setup.ts`에서 `@testing-library/jest-dom` import
