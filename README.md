# Notes App

React 19 + TypeScript + Vite 학습용 노트 CRUD 앱. JSON Server를 목업 백엔드로 사용한다.

## 시작하기

```bash
# 저장소 클론
git clone git@github.com:frongt/ccwork.git
cd ccwork

# 의존성 설치
pnpm install

# 개발 서버 실행 (프론트 + JSON Server 동시 실행)
pnpm run dev
```

- 앱: http://localhost:5173
- API: http://localhost:3001/notes

## 기술 스택

| 분류 | 기술 |
|------|------|
| UI | React 19, TypeScript 5 (strict), Tailwind CSS v4 |
| 번들러 | Vite 6 |
| 상태 관리 | React Context API |
| 목업 API | JSON Server (localhost:3001) |
| 테스트 | Vitest + Testing Library + jsdom |
| 코드 품질 | ESLint (flat config), Prettier, commitlint + Husky |
| 패키지 매니저 | pnpm |

## 개발 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm run dev` | 프론트(5173) + JSON Server(3001) 동시 실행 |
| `pnpm run build` | 타입 검사 + 프로덕션 빌드 |
| `pnpm run lint` | ESLint (--fix 포함) |
| `pnpm run format` | Prettier 포맷 |
| `pnpm test` | Vitest 단일 실행 |
| `pnpm run test:watch` | Vitest 감시 모드 |
| `pnpm run server` | JSON Server 단독 실행 |

## 아키텍처

### 컴포넌트 트리

```
App (selectedNoteId, isCreating 소유)
└── Layout (pure)
    ├── Sidebar → NoteList → NoteItem[]
    └── Main   → NoteEditor → TagInput
```

### 상태 흐름

- **전역**: `NotesContext` — notes 배열, loading, error, addNote/editNote/removeNote
- **로컬**: `NoteEditor` — title, content, tags (selectedNoteId 변경 시 useEffect로 동기화)
- **UI 상태**: `App` — selectedNoteId, isCreating

### 데이터 흐름 (노트 생성 예시)

```
App.isCreating = true
→ NoteEditor 빈 폼 마운트
→ 저장 클릭 → NotesContext.addNote()
→ api.createNote() POST → JSON Server
→ 서버 응답 → setNotes() → NoteList 리렌더
```

## 디렉터리 구조

```
src/
├── api/
│   └── notes.ts          # fetch 기반 CRUD (fetchNotes, createNote, updateNote, deleteNote)
├── components/
│   ├── AppToaster.tsx     # react-hot-toast 설정
│   ├── Layout.tsx         # sidebar/main props 받는 레이아웃
│   ├── NoteEditor.tsx     # 노트 생성/수정 폼
│   ├── NoteItem.tsx       # 노트 카드 (태그 뱃지 포함)
│   ├── NoteList.tsx       # 노트 목록
│   └── TagInput.tsx       # 인라인 태그 추가/수정/삭제
├── context/
│   └── NotesContext.tsx   # 전역 노트 상태 + useNotes() 훅
├── types/
│   └── note.ts            # Note 인터페이스
├── App.tsx
├── index.css              # CSS 변수 + Pretendard/Boogaloo 폰트
└── main.tsx
```

## 주요 기능

### 노트 CRUD

- 노트 생성 / 조회 / 수정 / 삭제
- 제목, 내용, 태그 관리
- 생성/수정 일시 자동 기록 (클라이언트에서 ISO 8601 생성)

### 태그

- 태그 목록 끝 `+` 버튼 클릭 → 인풋이 포함된 태그 뱃지 생성
- Enter로 확인, Esc 또는 blur로 취소
- 태그 클릭 시 인라인 편집 (뱃지 → input 전환)
- `×` 버튼으로 삭제
- 중복 태그 입력 시 Toast 알림: "이미 존재하는 태그입니다."
- 최대 10자 제한
- NoteList의 각 NoteItem에서 태그 뱃지 목록 확인 가능

## API

JSON Server가 `db.json`을 REST API로 노출한다.

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/notes` | 노트 목록 조회 |
| POST | `/notes` | 노트 생성 |
| PATCH | `/notes/:id` | 노트 수정 |
| DELETE | `/notes/:id` | 노트 삭제 |

## 코드 컨벤션

- **named export** 만 사용 (default export 없음)
- Props 인터페이스: `{컴포넌트명}Props`
- API 함수명: `{동사}{Entity}` (fetchNotes, createNote 등)
- 이벤트 핸들러: `handle{Action}`
- 불리언 state: `is{Condition}`
- 에러 처리: 초기 fetch는 Promise 체인, 뮤테이션은 try-catch-finally
- Prettier: 단일 따옴표, 2칸 들여쓰기, 100자 줄 너비, trailing commas
- 커밋: `@commitlint/config-conventional` 형식 (`feat`, `fix`, `docs` 등)
