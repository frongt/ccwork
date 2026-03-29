# Issue #2: 노트 카드에 태그가 표시된다

## 확정 시그니처

### 타입

변경 없음 — `Note` 타입에 이미 `tags: string[]` 존재

### 함수

변경 없음 — 읽기 전용(표시만), API/Context 변경 불필요

### 컴포넌트 Props

변경 없음 — `NoteItemProps`는 이미 `note: Note`를 받고 있어서 `note.tags`에 접근 가능

```ts
interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}
```

---

## 테스트 시나리오

### 정상

- [x] [정상] NoteItem — should display tag badges when note has tags
- [x] [정상] NoteItem — should display multiple tag badges when note has multiple tags

### 경계

- [x] [경계] NoteItem — should display 5 tag badges when note has maximum tags

### 예외

- [x] [예외] NoteItem — should not render tag area when note has no tags
- [x] [예외] NoteItem — should wrap tag badges to next line when tags overflow card width
