# PRD: 아카이브 기능 (Archive Feature)

**문서 버전:** 1.0
**작성일:** 2026-05-25
**상태:** 기획 중
**관련 컴포넌트:** `NoteList.tsx`, `NoteListScreen.tsx`, `NotesContext.tsx`, `src/api/notes.ts`, `src/types/note.ts`

---

## 1. 개요

### 배경

현재 노트 삭제는 즉시 영구 삭제(hard delete)로 처리된다. 실수로 삭제한 노트를 복구할 방법이 없으며, 의도치 않은 삭제 시 데이터 손실이 발생한다. 아카이브는 삭제된 노트를 영구 제거하지 않고 별도 보관 공간에 이동시켜 조회할 수 있도록 한다.

### 목표

- 노트 삭제 시 즉시 영구 삭제 대신 아카이브로 이동한다 (소프트 삭제).
- 하단 탭의 "Archive" 항목을 통해 보관된 노트 목록을 조회할 수 있다.
- 아카이브된 노트는 읽기 전용이다 — 수정 및 삭제 불가.

### 범위 (Scope)

| 포함 | 제외 |
|------|------|
| 삭제 시 아카이브로 이동 (소프트 삭제) | 아카이브에서 원복(restore) 기능 |
| 아카이브 목록 화면 (읽기 전용) | 아카이브 영구 삭제 |
| 하단 탭 "Archive" 화면 연동 | 아카이브 검색 / 태그 필터 |
| 노트 목록에서 아카이브된 노트 숨김 | 아카이브 일괄 처리 |

---

## 2. 사용자 스토리

### US-01: 노트 삭제 → 아카이브 이동
> 노트를 삭제하는 사용자로서, 실수로 삭제한 노트를 나중에 다시 볼 수 있어야 한다.

**수용 기준:**
- 노트 카드의 삭제 버튼을 클릭하면 해당 노트가 노트 목록에서 즉시 사라진다.
- 삭제된 노트는 아카이브 탭에서 조회할 수 있다.
- 삭제 성공 Toast 메시지: `"노트가 아카이브로 이동되었습니다."`

### US-02: 아카이브 목록 조회
> 아카이브 탭으로 이동한 사용자로서, 보관된 노트 목록을 확인하고 싶다.

**수용 기준:**
- 하단 탭 "Archive"를 누르면 아카이브 목록 화면으로 전환된다.
- 아카이브된 노트 카드가 노트 목록과 동일한 레이아웃으로 표시된다.
- 아카이브가 비어 있으면 빈 상태 메시지가 표시된다: `"보관된 노트가 없습니다."`

### US-03: 아카이브 노트 읽기 전용
> 아카이브된 노트를 클릭한 사용자로서, 내용을 읽을 수 있어야 한다.

**수용 기준:**
- 아카이브 노트 카드를 클릭하면 에디터 화면이 열린다.
- 에디터는 읽기 전용 모드로 표시된다 — 제목, 본문, 태그 수정 불가.
- 저장 버튼이 없고, TopAppBar에 "읽기 전용" 표시가 있다.
- 삭제 버튼이 노출되지 않는다.

---

## 3. 기능 명세

### 3.1 소프트 삭제 메커니즘

노트를 삭제할 때 레코드를 제거하지 않고 `archivedAt` 필드를 설정한다.

```
삭제 전: { id: "1", title: "...", archivedAt: null }
삭제 후: { id: "1", title: "...", archivedAt: "2026-05-25T10:00:00.000Z" }
```

**노트 목록 필터링:**
- `NoteList` 는 `archivedAt === null` 인 노트만 표시한다.
- `ArchiveList` 는 `archivedAt !== null` 인 노트만 표시한다.

### 3.2 타입 변경

```ts
// src/types/note.ts
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;  // 추가 — null이면 정상 노트
}
```

### 3.3 API 변경

| 함수 | 변경 내용 |
|------|---------|
| `createNote` | `archivedAt: null` 포함하여 생성 |
| `deleteNote` | 기존 DELETE 대신 `PATCH /notes/:id { archivedAt: ISO 문자열 }` |
| `fetchNotes` | 변경 없음 (필터링은 Context/컴포넌트에서 처리) |
| `updateNote` | 변경 없음 |

### 3.4 Context 변경

```ts
// NotesContext — removeNote 동작 변경
removeNote(id: string): Promise<void>
// → api.deleteNote() 대신 api.updateNote(id, { archivedAt: new Date().toISOString() })
```

`notes` 배열은 아카이브 포함 전체 노트를 유지한다.
각 화면에서 `archivedAt` 여부로 분기하여 렌더링한다.

### 3.5 뷰 상태 변경

```ts
// App.tsx — view 타입 확장
type View = 'list' | 'editor' | 'archive';
```

하단 탭 "Archive" 클릭 시 `view = 'archive'` 로 전환된다.

### 3.6 데이터 흐름

```
삭제 버튼 클릭
  └─ NoteList.handleDelete(id)
      └─ NotesContext.removeNote(id)
          └─ api.updateNote(id, { archivedAt: now })   ← PATCH
              └─ JSON Server db.json 업데이트
                  └─ notes 상태 갱신 → NoteList 리렌더
                      └─ archivedAt !== null → 목록에서 숨김
```

### 3.7 Toast 알림 사양

| 상황 | 종류 | 메시지 | 지속 시간 |
|------|------|--------|-----------|
| 아카이브 이동 성공 | success | `노트가 아카이브로 이동되었습니다.` | 3000ms |
| 아카이브 이동 실패 | error | `삭제에 실패했습니다.` | 3000ms |

---

## 4. UI 명세

### 4.1 화면 구조

아카이브 화면은 `NoteListScreen` 과 동일한 `MobileLayout` 구조를 사용한다.
단, 검색·필터·FAB 은 포함하지 않는다.

```
ArchiveScreen
└── MobileLayout
    ├── TopAppBar (title: "아카이브")
    └── ArchiveList
        └── NoteItem ×N  (읽기 전용 — 삭제 버튼 없음)
```

### 4.2 NoteItem 읽기 전용 모드

`NoteItem` 에 `isReadOnly?: boolean` prop을 추가한다.

| 요소 | 일반 모드 | 읽기 전용 모드 |
|------|---------|-------------|
| 삭제 버튼 | 표시 | 숨김 |
| 클릭 시 동작 | `onSelect(id)` — 편집 화면 이동 | `onSelect(id)` — 읽기 전용 에디터 이동 |

### 4.3 NoteEditor 읽기 전용 모드

`NoteEditor` 에 `isReadOnly?: boolean` prop을 추가한다.

| 요소 | 편집 모드 | 읽기 전용 모드 |
|------|---------|-------------|
| 제목 input | 활성화 | `disabled` |
| 본문 RichEditor | 활성화 | `readOnly` |
| TagInput | 활성화 | 숨김 (태그는 표시만) |
| TopAppBar 우측 | 저장 버튼 | "읽기 전용" 레이블 |
| TopAppBar 좌측 | 뒤로가기 | 뒤로가기 (동일) |

### 4.4 하단 탭 연동

`BottomNav` 의 "Archive" 항목 `onClick` 을 `() => setView('archive')` 로 연결한다.
Notes 탭 복귀 시 `setView('list')` 로 전환된다.

### 4.5 빈 상태

| 화면 | 아이콘 | 제목 | 설명 |
|------|--------|------|------|
| 아카이브 목록 (비어 있음) | 📦 | 보관된 노트가 없습니다 | 삭제한 노트가 여기에 보관됩니다. |

---

## 5. 비기능 요구사항

| 항목 | 요구사항 |
|------|---------|
| 데이터 안전성 | 소프트 삭제 — 레코드는 db.json에 유지, 복구 가능한 구조 |
| 하위 호환성 | 기존 노트(`archivedAt` 필드 없음)는 `null` 로 간주하여 정상 표시 |
| 낙관적 UI | 아카이브 이동 시 서버 응답 전 목록에서 즉시 숨김 (기존 패턴 유지) |
| 접근성 | 읽기 전용 에디터 요소에 `disabled` / `readOnly` 속성 명시 |

---

## 6. 구현 순서 (권장)

1. `src/types/note.ts` — `archivedAt: string | null` 필드 추가
2. `src/api/notes.ts` — `deleteNote` → PATCH 방식으로 변경, `createNote` 에 `archivedAt: null` 추가
3. `src/context/NotesContext.tsx` — `removeNote` 로직 변경
4. `db.json` — 기존 시드 데이터에 `archivedAt: null` 추가
5. `src/components/NoteList.tsx` — `archivedAt === null` 필터 추가
6. `src/components/NoteItem.tsx` — `isReadOnly` prop 추가
7. `src/components/NoteEditor.tsx` — `isReadOnly` prop 추가
8. `src/components/ArchiveScreen.tsx` — 신규 화면 컴포넌트 생성
9. `src/App.tsx` — `view` 타입 확장, ArchiveScreen 조건부 렌더링
10. `src/components/NoteListScreen.tsx` — BottomNav Archive 탭 onClick 연결

---

## 7. 미구현 / 향후 개선 사항

| 항목 | 우선순위 | 비고 |
|------|---------|------|
| 아카이브 → 노트 복원 기능 | 중간 | `archivedAt: null` 로 PATCH |
| 아카이브 영구 삭제 | 낮음 | DELETE API 재활용 |
| 아카이브 검색 / 태그 필터 | 낮음 | `NoteListScreen` 패턴 재사용 |
| 아카이브 자동 만료 (예: 30일 후 삭제) | 낮음 | 서버 사이드 처리 필요 |
