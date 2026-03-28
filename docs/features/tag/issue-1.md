# Issue #1: 노트에 태그를 추가/제거할 수 있다

## 확정 시그니처

### 타입

```ts
// src/types/note.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];  // NEW
  createdAt: string;
  updatedAt: string;
}
```

### 함수

**API 레이어** — 코드 변경 없음 (타입 변경으로 자동 반영)
- `createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>)` → tags 필수
- `updateNote(id: string, updates: Partial<Note>)` → `{ tags: [...] }` 전송 가능

**Context** — addNote 시그니처 변경
```ts
// 변경 전: addNote(title: string, content: string): Promise<void>
// 변경 후: addNote(title: string, content: string, tags: string[]): Promise<void>
```

**태그 유효성 검증 유틸**
```ts
// src/utils/tagValidation.ts
validateTag(input: string): { valid: boolean; normalized: string }
```
- trim + 소문자 정규화
- 한글/영문/숫자만 허용 (`/^[가-힣a-z0-9]+$/`)
- 20자 이하
- 에러: 특수문자 포함 → `{ valid: false, normalized: "" }`
- 에러: 21자 이상 → `{ valid: false, normalized: "" }`
- 에러: 빈 문자열 → `{ valid: false, normalized: "" }`

### 컴포넌트 Props

```ts
// src/components/TagInput.tsx
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}
```

NoteEditorProps — 변경 없음 (tags는 NoteEditor 내부 state)

---

## 테스트 시나리오

### 정상
- [x] [정상] validateTag — should return `{ valid: true, normalized: "react" }` when input is "React"
- [x] [정상] TagInput — should add tag as chip when user types valid text and presses Enter
- [x] [정상] TagInput — should clear input field after adding tag
- [x] [정상] TagInput — should remove tag when X button is clicked
- [x] [정상] NoteEditor — should save tags when creating a new note
- [x] [정상] NoteEditor — should save tags when editing an existing note
- [x] [정상] NoteEditor — should display existing tags as chips when entering edit mode
- [x] [정상] NoteEditor — should send PATCH request immediately when tag is added (without save button)
- [x] [정상] NoteEditor — should send PATCH request immediately when tag is removed (without save button)

### 경계
- [x] [경계] validateTag — should return valid when tag is exactly 20 characters
- [x] [경계] validateTag — should return valid when tag is 1 character
- [x] [경계] TagInput — should add 5th tag and then disable input
- [x] [경계] validateTag — should normalize "REACT" to "react"
- [x] [경계] validateTag — should return valid when tag contains Korean characters ("태그")
- [x] [경계] validateTag — should return valid when tag contains mixed Korean and numbers ("태그123")

### 예외
- [x] [예외] validateTag — should return invalid when input contains special characters ("tag!")
- [x] [예외] validateTag — should return invalid when input is 21 characters
- [x] [예외] validateTag — should return invalid when input is empty string
- [x] [예외] validateTag — should return invalid when input contains spaces ("my tag")
- [x] [예외] TagInput — should not add tag when duplicate tag is entered
- [x] [예외] TagInput — should clear input when duplicate tag is entered
- [x] [예외] TagInput — should disable input when tags count is 5
- [x] [예외] TagInput — should display error message when duplicate tag is entered
- [x] [예외] TagInput — should display error message when tag count exceeds 5
- [x] [예외] TagInput — should display error message when tag contains invalid characters
- [x] [예외] TagInput — should display error message when tag exceeds 20 characters
- [x] [예외] TagInput — should not submit form when Enter is pressed to add tag
