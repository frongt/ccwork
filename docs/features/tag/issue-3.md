# Issue #3: 사이드바에서 태그로 노트를 필터링할 수 있다

## 확정 시그니처

### 타입

변경 없음

### 함수

**필터링 순수 함수** (신규)

```ts
// src/utils/noteFilters.ts
filterNotesByTags(notes: Note[], selectedTags: string[]): Note[]
```
- `selectedTags`가 빈 배열이면 전체 노트 반환
- OR 조건: 노트의 tags 중 하나라도 selectedTags에 포함되면 매칭

**전체 태그 추출 순수 함수** (신규)

```ts
// src/utils/noteFilters.ts
extractAllTags(notes: Note[]): string[]
```
- `notes.flatMap(n => n.tags)` → 중복 제거 → 정렬
- 빈 배열이면 빈 배열 반환

### 컴포넌트 Props

**TagFilter** (신규)

```ts
// src/components/TagFilter.tsx
interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}
```

**NoteList** (변경)

```ts
interface NoteListProps {
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  selectedTags: string[];  // NEW
}
```

**Layout** (변경)

```ts
interface LayoutProps {
  onNewNote: () => void;
  sidebar: ReactNode;
  main: ReactNode;
  tagFilter: ReactNode;  // NEW
}
```

---

## 테스트 시나리오

### 정상

- [x] [정상] extractAllTags — 모든 노트에서 태그를 정렬된 유니크 목록으로 반환한다
- [x] [정상] filterNotesByTags — 선택한 태그를 하나라도 가진 노트를 반환한다 (OR 조건)
- [x] [정상] TagFilter — 모든 태그를 뱃지로 표시한다
- [x] [정상] TagFilter — 뱃지 클릭 시 해당 태그 이름으로 onToggle을 호출한다
- [x] [정상] TagFilter — 선택된 태그와 미선택 태그를 시각적으로 구분한다
- [x] [정상] NoteList — selectedTags가 있으면 필터링된 노트만 표시한다

### 경계

- [x] [경계] filterNotesByTags — selectedTags가 빈 배열이면 전체 노트를 반환한다
- [x] [경계] extractAllTags — 태그가 있는 노트가 없으면 빈 배열을 반환한다
- [x] [경계] filterNotesByTags — 여러 태그 선택 시 하나라도 매칭되면 반환한다 (OR)
- [x] [경계] TagFilter — allTags가 빈 배열이면 렌더링하지 않는다

### 예외

- [x] [예외] extractAllTags — 여러 노트에 중복된 태그가 있으면 중복을 제거한다
- [x] [예외] filterNotesByTags — 매칭되는 노트가 없으면 빈 배열을 반환한다
- [x] [예외] NoteList — 노트가 변경되면(태그 추가/삭제) 태그 목록이 자동 갱신된다
