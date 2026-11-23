# 이슈 1. 노트를 삭제하면 휴지통에서 확인할 수 있다 — 테스트 시나리오

> GitHub 이슈: #9 / 기준 문서: prd.md, spec-fixed.md

## 시그니처

선언만 기록한다. 구현은 TDD에서 테스트를 먼저 쓴 뒤 작성한다.

### src/types/note.ts (수정)

```ts
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[]; // 태그 기능에서 추가되면 그대로 유지
  deletedAt?: string | null; // 신규. 값이 있으면 휴지통 노트
}
```

### src/utils/trash.ts (신규, 규칙)

```ts
export interface PartitionedNotes {
  activeNotes: Note[]; // deletedAt == null (필드 없음 포함)
  trashedNotes: Note[]; // deletedAt != null
}

export declare function partitionNotes(notes: Note[]): PartitionedNotes; // 입력 순서 유지, 원본 불변
export declare function sortByDeletedAt(notes: Note[]): Note[]; // deletedAt 내림차순, 새 배열 반환
```

### src/context/NotesContext.tsx (수정, 상태)

```ts
interface NotesContextType {
  notes: Note[]; // 일반 노트만 (파생)
  trashedNotes: Note[]; // 휴지통 노트, 최근 삭제 순 (파생)
  loading: boolean;
  error: string | null;
  createNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>; // 기존 유지(영구 삭제, 이슈 4에서 사용)
  trashNote: (id: string) => Promise<void>; // 신규
}
```

### src/hooks/useConfirmAction.ts (신규, 상태)

```ts
export interface UseConfirmActionResult<T> {
  pending: T | null; // 확인 대기 중인 대상. null이면 Confirm 닫힘
  request: (target: T) => void; // Confirm 열기
  confirm: () => Promise<void>; // pending으로 action 실행 후 닫기
  cancel: () => void; // action 호출 없이 닫기
}

export declare function useConfirmAction<T>(
  action: (target: T) => Promise<void>,
): UseConfirmActionResult<T>;
```

### 표현 컴포넌트 (신규, props만 받음)

```ts
// src/components/SidebarFooter.tsx — aria-label="휴지통" 아이콘 버튼
interface SidebarFooterProps {
  onOpenTrash: () => void;
}

// src/components/TrashList.tsx — 삭제일 표시 항목, 빈 상태, 일반 목록으로 돌아가는 버튼
interface TrashListProps {
  notes: Note[]; // 이미 정렬된 휴지통 노트
  onBack: () => void;
}
```

### 수정 컴포넌트 / 조립

```ts
// NoteList: 삭제 시 useConfirmAction + Confirm 표시, 확인 시 trashNote, 실패 시 alert
interface NoteListProps {
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  onTrashed: (id: string) => void; // 신규. 삭제 성공 후 호출 (App이 선택 해제)
}
// NoteItem: Props 변경 없음 (onDelete는 "Confirm 요청"을 의미하게 됨)

// App: 신규 상태 `sidebarView: 'notes' | 'trash'`
//   삭제된 id가 selectedNoteId이면 null로 해제.
```

#### 에러 케이스

- `trashNote`: PATCH 응답 `!res.ok` → `api.updateNote`가 `Error('Failed to update note')`를 던지고, Context는 로컬 상태를 바꾸지 않고 reject로 그대로 전파한다. `NoteList`가 `try/catch`에서 `alert`로 알린다. 별도 `api.trashNote` 래퍼 없이 `api.updateNote(id, { deletedAt: new Date().toISOString() })`를 호출한다.
- `partitionNotes`/`sortByDeletedAt`: 던지지 않는다. 빈 배열은 빈 결과를 반환한다.
- `useConfirmAction.confirm`: `action`이 reject하면 그 에러를 호출자에게 전파하고, `pending`은 닫는다.

## 테스트 시나리오

### 정상

1. [정상] partitionNotes — should `activeNotes`에는 deletedAt이 없는 노트를, `trashedNotes`에는 deletedAt이 있는 노트를 담아 반환 when 두 종류가 섞인 배열
2. [정상] partitionNotes — should 각 그룹에서 입력 순서를 유지 when 여러 노트가 섞여 있음
3. [정상] sortByDeletedAt — should 최근 삭제 순(deletedAt 내림차순)으로 정렬해 반환 when deletedAt이 서로 다른 노트 여러 개
4. [정상] trashNote — should `PATCH`로 현재 일시의 `deletedAt`을 보내고 해당 노트를 `notes`에서 제거 when 서버가 성공 응답
5. [정상] trashNote — should 해당 노트를 `trashedNotes`에 포함 when 서버가 성공 응답
6. [정상] NotesContext — should `trashedNotes`를 최근 삭제 순으로 노출 when 삭제일이 다른 휴지통 노트가 여럿 있음
7. [정상] useConfirmAction — should `pending`에 대상을 담아 Confirm 열림 상태가 됨 when `request(target)` 호출
8. [정상] useConfirmAction — should `action`을 대상과 함께 호출하고 `pending`을 null로 닫음 when `confirm()` 호출
9. [정상] useConfirmAction — should `action` 호출 없이 `pending`을 null로 닫음 when `cancel()` 호출
10. [정상] NoteList — should `Confirm`을 표시하고 노트는 그대로 둠 when 삭제 버튼 클릭
11. [정상] NoteList — should `trashNote`를 해당 id로 호출 when `Confirm`에서 확인 클릭
12. [정상] NoteList — should 서버 호출 없이 `Confirm`을 닫고 노트가 남음 when `Confirm`에서 취소 클릭
13. [정상] NoteList — should 서버 호출 없이 `Confirm`을 닫음 when `Confirm`의 닫기(×) 클릭
14. [정상] NoteList — should `onTrashed(id)`를 호출 when 삭제가 성공
15. [정상] App — should 선택 상태를 해제(에디터가 비어 있는 상태) when 선택 중인 노트를 삭제
16. [정상] SidebarFooter — should `onOpenTrash`를 호출 when `aria-label="휴지통"` 버튼 클릭
17. [정상] App — should 사이드바가 휴지통 목록으로 전환되고 일반 목록으로 돌아가는 버튼이 보임 when 휴지통 버튼 클릭
18. [정상] TrashList — should 삭제된 노트를 전달받은 순서(최근 삭제 순)대로 표시 when 휴지통 노트가 여러 개
19. [정상] TrashList — should 수정일 대신 삭제일(`toLocaleDateString('ko-KR')`)을 표시 when 휴지통 노트가 있음
20. [정상] TrashList — should `onBack`을 호출 when 돌아가기 버튼 클릭

### 경계

21. [경계] partitionNotes — should 해당 노트를 `activeNotes`에 포함 when `deletedAt` 필드가 없는 기존 노트
22. [경계] partitionNotes — should 해당 노트를 `activeNotes`에 포함 when `deletedAt`이 `null`
23. [경계] partitionNotes — should 두 그룹 모두 빈 배열을 반환 when 빈 배열 입력
24. [경계] partitionNotes — should 입력 배열과 노트 객체를 변경하지 않음 when 호출 후
25. [경계] sortByDeletedAt — should 빈 배열을 반환 when 빈 배열 입력
26. [경계] sortByDeletedAt — should 입력 배열의 순서를 바꾸지 않고 새 배열을 반환 when 호출 후
27. [경계] NotesContext — should 모든 노트를 `notes`에 표시하고 에러가 나지 않음 when 서버 데이터가 전부 `deletedAt` 없음
28. [경계] NotesContext — should 삭제된 노트를 `notes`에서 제외 when 초기 로딩 데이터에 `deletedAt`이 있는 노트가 섞여 있음
29. [경계] TrashList — should 빈 상태 한국어 문구를 표시 when `notes`가 빈 배열
30. [경계] App — should 선택 상태를 유지 when 선택 중이 아닌 다른 노트를 삭제

### 예외

31. [예외] trashNote — should reject하고 `notes`를 바꾸지 않음 when 서버가 `!res.ok` 응답
32. [예외] NoteList — should `alert`로 실패를 알리고 노트가 일반 목록에 남음 when `trashNote`가 reject
33. [예외] NoteList — should `onTrashed`를 호출하지 않음 when `trashNote`가 reject
34. [예외] useConfirmAction — should 에러를 호출자에게 전파하고 `pending`을 null로 닫음 when `action`이 reject

## AC 커버리지

| AC                                                                     | 시나리오     |
| ---------------------------------------------------------------------- | ------------ |
| 삭제 버튼 → `Confirm` 표시, 노트는 아직 그대로                         | 10           |
| `Confirm` 취소/닫기 → 서버 호출 없이 닫히고 노트 유지                  | 9, 12, 13    |
| 확인 → PATCH로 `deletedAt` 기록, 응답 후 일반 목록에서 제거            | 4, 8, 11     |
| 선택 중 노트 삭제 → 선택 해제                                          | 14, 15, 30   |
| 삭제된 노트가 `notes`(목록·검색·태그용)에 포함되지 않음                | 1, 4, 28     |
| 휴지통 아이콘(`aria-label="휴지통"`) → 휴지통 목록 전환, 돌아가는 수단 | 16, 17, 20   |
| 휴지통 뷰: 최근 삭제 순, 수정일 대신 삭제일 표시                       | 3, 6, 18, 19 |
| 휴지통이 비어 있으면 빈 상태 한국어 문구                               | 29           |
| 삭제 요청 서버 오류 → `alert`, 노트는 일반 목록에 남음                 | 31, 32, 33   |
| `deletedAt` 없는 기존 노트 → 모두 일반 목록에 에러 없이 표시           | 21, 22, 27   |

AC 밖 시나리오: 2, 23~26, 34(시그니처 계약 검증), 5(`trashedNotes` 반영).
