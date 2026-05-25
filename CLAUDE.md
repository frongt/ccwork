# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

React 19 + TypeScript + Vite 학습용 노트 앱. JSON Server를 목업 백엔드로 사용하는 CRUD 메모 애플리케이션.
패키지 매니저: pnpm 사용중

## 개발 명령어

```bash
pnpm run dev          # Vite 개발 서버 + JSON Server 동시 실행 (프론트: 5173, API: 3001)
pnpm run build        # 타입 검사 + 프로덕션 빌드
pnpm run lint         # ESLint (--fix 포함)
pnpm run format       # Prettier 포맷
pnpm test             # Vitest 단일 실행
pnpm run test:watch   # Vitest 감시 모드
pnpm run server       # JSON Server 단독 실행
```

## 아키텍처

### 상태 흐름

```
App (selectedNoteId, isCreating 소유)
└── Layout (pure)
    ├── Sidebar → NoteList → NoteItem[]
    └── Main   → NoteEditor
```

- **전역 상태**: `NotesContext` (`src/context/NotesContext.tsx`) — notes 배열, loading, error, addNote/editNote/removeNote 액션 제공
- **API 레이어**: `src/api/notes.ts` — JSON Server(`localhost:3001`)와 통신하는 fetch 기반 CRUD 함수
- **로컬 폼 상태**: `NoteEditor` 내부에서 title/content 관리, `selectedNoteId` 변경 시 `useEffect`로 동기화

### 데이터 흐름 (노트 생성)

1. `App` → `isCreating=true` 설정
2. `NoteEditor` 빈 폼으로 마운트
3. 저장 시 `NotesContext.addNote()` 호출 → `api.createNote()` POST
4. 서버 응답으로 `notes` 상태 업데이트 → `NoteList` 리렌더

### 주요 패턴

- **Layout 컴포넌트**: `sidebar`, `main`을 `ReactNode` props으로 받는 의존성 주입 패턴
- **Context 커스텀 훅**: `useNotes()` — Provider 밖에서 호출 시 에러 throw
- **이벤트 버블링 차단**: NoteItem 삭제 버튼에서 `e.stopPropagation()` 사용

## 기술 스택

- React 19, TypeScript 5 (strict mode), Vite 6, Tailwind CSS v4
- JSON Server (목업 REST API), Concurrently (병렬 실행)
- Vitest + Testing Library + jsdom (테스트 인프라 구비, 테스트 파일 미작성 상태)

## 코드 컨벤션

- Prettier: 단일 따옴표, 2칸 들여쓰기, 100자 줄 너비, trailing commas
- ESLint: flat config, React Hooks 규칙, TypeScript 지원
- 타입 정의: `src/types/note.ts`의 `Note` 인터페이스 (tags 필드 TODO)
- UI 테마: `src/index.css`의 CSS 변수(`--color-background` 등) + Pretendard/Boogaloo 폰트

## 목업 데이터

`db.json` — JSON Server 데이터베이스 (시드 데이터 3개 포함, 개발 중 직접 수정 가능)

---

## 컴포넌트 구현 패턴

### 구조

```tsx
// 1. Props 인터페이스 먼저 선언
interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

// 2. named export로 컴포넌트 선언
export function NoteItem({ note, isSelected, onSelect, onDelete }: NoteItemProps) {
  // 핸들러
  // JSX
}
```

- Props 인터페이스: `{컴포넌트명}Props` 형식 (`NoteItemProps`, `NoteEditorProps` 등)
- 컴포넌트 파일 모두 **named export** 사용 (`App.tsx` 포함, 예외 없음)
- Props는 함수 파라미터에서 바로 구조분해
- 조건부 렌더링 순서: loading → error → empty → 정상 데이터 (NoteList 패턴)

### 조건부 렌더링

```tsx
// loading/error/empty 순서로 early return
if (loading) return <div>...</div>;
if (error) return <div>...</div>;
if (notes.length === 0) return <div>...</div>;
return <ul>...</ul>;
```

---

## 상태 관리 방식

### 전역 상태 (NotesContext)

```tsx
// 컨텍스트 타입: {Feature}ContextType
interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  addNote: (title: string, content: string) => Promise<void>;
  editNote: (id: string, updates: Partial<Note>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
}

// createContext 기본값은 null
const NotesContext = createContext<NotesContextType | null>(null);

// 커스텀 훅으로 감싸서 null 가드
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
```

- 컨텍스트 기본값은 `null`로 설정 → `useNotes()` 훅에서 null 체크 후 throw
- 초기 데이터 fetch는 Provider의 `useEffect([], [])` 에서 수행
- 액션 함수는 API 호출 후 `setNotes` 로 상태 직접 갱신 (서버 응답 기반)

### 로컬 상태

```tsx
// 불리언 상태: is{Condition}
const [isCreating, setIsCreating] = useState(false);
// 비동기 작업 진행 상태: saving (is 접두사 없이 사용)
const [saving, setSaving] = useState(false);
// nullable: string | null 패턴
const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
```

### useEffect 사용 규칙

- 의존성 배열은 항상 명시 (`[]` 포함)
- 파생 상태(`selectedNote = notes.find(...)`)는 의존성 배열에서 제외하고 기반 값(`selectedNoteId`)만 포함
  - `NoteEditor.tsx`에서 `// eslint-disable-line react-hooks/exhaustive-deps` 주석으로 명시적 처리

---

## API 호출 패턴

### API 모듈 (`src/api/notes.ts`)

```ts
const API_URL = 'http://localhost:3001'; // 하드코딩 (환경변수 미적용)

// 함수명: {동사}{Entity} — fetchNotes, createNote, updateNote, deleteNote
export async function createNote(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      createdAt: new Date().toISOString(), // 타임스탬프는 클라이언트에서 생성
      updatedAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}
```

- fetch 기반, axios 미사용
- 에러 처리: `if (!res.ok) throw new Error(메시지)` 패턴 — 모든 함수 일관적으로 적용
- 타임스탬프(`createdAt`, `updatedAt`)는 클라이언트에서 `new Date().toISOString()` 생성
- 재시도, 취소(AbortController), 인터셉터 없음

### Context에서 API 호출 (초기 fetch)

```ts
// Promise 체인 패턴
useEffect(() => {
  api.fetchNotes()
    .then(setNotes)
    .catch((e) => setError(e.message))
    .finally(() => setLoading(false));
}, []);
```

### 컴포넌트에서 API 호출 (뮤테이션)

```ts
// async/await + try-catch-finally 패턴
const handleSave = async () => {
  setSaving(true);
  try {
    await addNote(title, content); // context 액션 호출
    onDone();
  } catch (e) {
    console.error(e);
    alert('저장에 실패했습니다');
  } finally {
    setSaving(false);
  }
};
```

- 컨텍스트 액션(`addNote`, `editNote`)을 직접 호출하며, API 모듈을 컴포넌트에서 직접 import하지 않음
- import 패턴: `import * as api from '../api/notes'` (네임스페이스 임포트)

---

## 네이밍 패턴

| 대상 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `NoteItem.tsx`, `NoteEditor.tsx` |
| 타입/API 파일 | camelCase | `note.ts`, `notes.ts` |
| 컴포넌트 | PascalCase | `NoteItem`, `NoteEditor`, `Layout` |
| Props 인터페이스 | `{Name}Props` | `NoteItemProps`, `LayoutProps` |
| 컨텍스트 타입 | `{Name}ContextType` | `NotesContextType` |
| API 함수 | `{동사}{Entity}` | `fetchNotes`, `createNote`, `deleteNote` |
| 이벤트 핸들러 | `handle{Action}` | `handleSave`, `handleSelectNote`, `handleDone` |
| 커스텀 훅 | `use{Feature}` | `useNotes` |
| 불리언 state | `is{Condition}` | `isCreating`, `isSelected` |
| state setter | `set{Name}` | `setTitle`, `setSaving` |
| 배열 state | 복수형 | `notes` |

---

## 패턴 불일치 목록

현재 코드베이스에서 확인된 불일치. 수정 시 아래 결정을 따를 것.

### 1. 에러 처리 전략 혼재

| 위치 | 방식 |
|------|------|
| `NotesContext` 초기 fetch | Promise `.catch()` → `setError(e.message)` |
| `NoteEditor` 저장 | `try-catch` → `console.error` + `alert()` |

- **결정**: 뮤테이션(생성/수정/삭제)은 `try-catch-finally` 사용. 초기 fetch는 Promise 체인 유지.
- `alert()` 는 임시 구현 — 향후 토스트/인라인 에러 UI로 교체 예정

### 2. 로딩 상태 분산

- `NotesContext.loading`: 초기 fetch 전용 전역 상태
- `NoteEditor.saving`: 저장 작업 전용 로컬 상태
- **결정**: 각 작업 범위에 맞게 유지. 전역 로딩 스피너가 필요하면 Context 확장.

### 3. 에러 객체 타입 미보장

- `NotesContext.tsx`: `.catch((e) => setError(e.message))` — `e`가 Error 객체임을 보장하지 않음
- **결정**: 신규 코드에서는 `e instanceof Error ? e.message : String(e)` 패턴 사용

### 4. API URL 환경변수 미적용

- `src/api/notes.ts`: `'http://localhost:3001'` 하드코딩
- **결정**: 현재는 학습용이므로 유지. 배포 전 `import.meta.env.VITE_API_URL` 로 전환 필요

---

## 커밋 메시지 규칙

`@commitlint/config-conventional` 기준. husky `commit-msg` 훅으로 자동 검증됨.

### 형식

```
type(scope): subject

[body]

[footer]
```

### type (필수, 소문자)

| type | 용도 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 코드 의미에 영향 없는 포맷 변경 (공백, 세미콜론 등) |
| `refactor` | 버그 수정도 기능 추가도 아닌 코드 변경 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가 또는 수정 |
| `build` | 빌드 시스템 또는 외부 의존성 변경 (npm, vite 등) |
| `ci` | CI 설정 파일 및 스크립트 변경 |
| `chore` | src/test 파일을 수정하지 않는 기타 변경 |
| `revert` | 이전 커밋 되돌리기 |

### 세부 규칙

- **header** 최대 100자
- **subject**: 비어있으면 안 됨, 마침표(`.`) 로 끝내지 않음, `Sentence-case` / `Start-Case` / `PascalCase` / `UPPER CASE` 사용 금지
- **type**: 소문자(`lower-case`) 필수
- **body**: 첫 줄 앞에 빈 줄 필요, 각 줄 최대 100자
- **footer**: 첫 줄 앞에 빈 줄 필요, 각 줄 최대 100자

### 예시

```
feat(NoteEditor): 저장 성공 시 toast 알림 추가
fix(NoteList): 삭제 실패 시 에러 처리 누락 수정
chore: husky commit-msg 훅 설정 추가
docs: CLAUDE.md 커밋 규칙 섹션 추가
refactor(NotesContext): removeNote 에러 처리 패턴 통일
```
