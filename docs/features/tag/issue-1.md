# 이슈 1. 기존 노트에 태그를 추가하고 저장한다 — 테스트 시나리오

> GitHub 이슈: #2 / 기준 문서: prd.md, spec-fixed.md

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
  tags?: string[]; // 신규. "tags 필드는 아직 없음" 주석은 정리한다
}
```

### src/utils/tags.ts (신규, 규칙)

```ts
export interface TagValidationResult {
  canAdd: boolean; // 추가 가능 여부
  tag: string; // trim된 값
  message: string | null; // 안내 문구. 이번 이슈에서는 항상 null
}

export declare function validateTag(input: string, existing: string[]): TagValidationResult;
```

### src/hooks/useTagEditor.ts (신규, 상태)

```ts
export interface UseTagEditorResult {
  tags: string[];
  isInputOpen: boolean;
  inputValue: string;
  toggleInput: () => void;
  changeInput: (value: string) => void;
  addTag: () => void; // inputValue를 검증해 추가한다. Enter에서 호출된다
  reset: (initialTags: string[]) => void; // tags 교체 + 입력창 닫기 + inputValue 비우기
}

export declare function useTagEditor(): UseTagEditorResult;
```

### src/components/Tag.tsx (신규, 표현. 삭제 버튼 없는 최소형)

```ts
interface TagProps {
  label: string;
}

export declare function Tag(props: TagProps): JSX.Element;
```

### src/components/TagList.tsx (신규, 표현)

```ts
interface TagListProps {
  tags: string[];
}

export declare function TagList(props: TagListProps): JSX.Element | null; // 빈 배열이면 null
```

### src/components/TagInput.tsx (신규, 표현. 토글 버튼 포함)

```ts
interface TagInputProps {
  isOpen: boolean;
  value: string;
  onToggle: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void; // Enter 입력 시. 내부에서 preventDefault 후 호출한다
}

export declare function TagInput(props: TagInputProps): JSX.Element;
```

### 변경되지 않는 시그니처

- `NoteEditorProps`: `{ selectedNoteId: string | null; isCreating: boolean; onDone: () => void }`
- `NotesContextType.updateNote`: `(id: string, updates: Partial<Note>) => Promise<void>`
- `api.updateNote`: `(id: string, updates: Partial<Note>) => Promise<Note>` (`Partial<Note>`가 `tags`를 그대로 통과시킨다)
- `createNote`(Context, API)는 이번 이슈 범위 밖이다. 문서 이슈 5에서 다룬다.

### NoteEditor의 동작 변화 (시그니처 아님)

- 저장 시 `updateNote(selectedNoteId, { title, content, tags })`로 `tags`를 함께 보낸다.
- 노트가 전환될 때 기존 `useEffect`에서 `reset(selectedNote?.tags ?? [])`를 호출한다.
- 태그 UI(`TagInput`, `TagList`)는 `isCreating === false`일 때만 렌더한다. 생성 모드 지원은 문서 이슈 5에서 이 조건을 해제한다.

### 확정된 결정

- 토글 버튼("태그 추가"/"닫기")은 `TagInput` 안에 둔다.
- 생성 모드(`isCreating`)에서는 이번 이슈에서 태그 UI를 숨긴다.
- `validateTag`는 `{ canAdd, tag, message }` 평평한 객체를 반환한다.
- 입력창 `aria-label`은 "태그 입력"으로 컴포넌트 내부에 고정한다.

### 에러 케이스

- `validateTag`에 빈 값 또는 공백만 입력 → 던지지 않고 `{ canAdd: false, tag: '', message: null }`을 반환한다.
- `validateTag`는 순수 함수라 어떤 입력에도 던지지 않는다. `existing`은 이번 이슈에서 사용하지 않는다(중복 검사는 문서 이슈 3).
- `useTagEditor.addTag`에서 `canAdd: false` → 던지지 않고 상태를 바꾸지 않는다(`tags`, `inputValue` 그대로).
- `NoteEditor` 저장 시 제목이 비어 있음 → 기존 동작 유지. `console.error('제목을 입력해주세요')` 후 `updateNote`를 호출하지 않는다.
- `NoteEditor` 저장 시 서버 응답 실패 → `updateNote`가 `Error('Failed to update note')`로 reject. 기존대로 `console.error('저장에 실패했습니다')`, `onDone`을 호출하지 않고 편집 중이던 `tags`는 유지한다.

## 테스트 시나리오

형식: `[분류] 대상 — should 기대동작 when 조건`. 앞의 ID는 아래 AC 커버리지 표에서 참조한다.

### validateTag (단위)

**정상**

- [x] V1 `[정상] validateTag — should canAdd true, trim된 tag, message null을 반환 when 앞뒤 공백이 있는 유효 입력('  react  ')`
- [x] V2 `[정상] validateTag — should 입력을 그대로 tag로 반환 when 공백이 없는 입력('react')`

**경계**

- [x] V3 `[경계] validateTag — should canAdd false, tag '', message null을 반환 when 빈 문자열`
- [x] V4 `[경계] validateTag — should canAdd false, tag '', message null을 반환 when 공백·탭·줄바꿈만 있는 입력`
- [x] V5 `[경계] validateTag — should 중간 공백을 유지 when 'react native'처럼 단어 사이에 공백이 있는 입력`

**예외**

- [x] V6 `[예외] validateTag — should 던지지 않고 결과 객체를 반환 when 빈 값이나 공백만 입력`

### useTagEditor (renderHook)

**정상**

- [x] H1 `[정상] useTagEditor — should tags [], isInputOpen false, inputValue ''로 시작 when 마운트`
- [x] H2 `[정상] toggleInput — should isInputOpen을 true로 when 닫힌 상태에서 호출`
- [x] H3 `[정상] toggleInput — should isInputOpen을 false로 when 열린 상태에서 호출`
- [x] H4 `[정상] changeInput — should inputValue를 전달한 값으로 갱신 when 값을 전달`
- [x] H5 `[정상] addTag — should trim된 태그를 tags 끝에 추가하고 inputValue를 ''로 비움 when inputValue가 '  react  '`
- [x] H6 `[정상] addTag — should 입력 순서대로 tags에 쌓고 isInputOpen을 유지 when 'react', 'design'을 연속 추가`
- [x] H7 `[정상] reset — should tags를 initialTags로 교체하고 isInputOpen false, inputValue ''로 when 태그 입력 중인 상태에서 호출`

**경계**

- [x] H8 `[경계] addTag — should 상태를 바꾸지 않음 when inputValue가 빈 문자열`
- [x] H9 `[경계] addTag — should 상태를 바꾸지 않음 when inputValue가 공백만`
- [x] H10 `[경계] reset — should tags를 빈 배열로 when initialTags가 [] (tags가 없는 기존 노트)`
- [x] H11 `[경계] addTag — should reset에 전달한 initialTags 배열을 변경하지 않음 when reset 후 태그를 추가`
- [x] H12 `[경계] reset — should 이전 노트의 태그가 남지 않음 when 다른 initialTags로 연속 reset`

### Tag / TagList / TagInput (props 기반 컴포넌트)

**정상**

- [x] T1 `[정상] Tag — should label 텍스트를 표시 when label이 'react'`
- [x] TL1 `[정상] TagList — should 모든 태그를 전달된 순서대로 표시 when tags가 ['react', 'design']`
- [x] TL2 `[정상] TagList — should flex-wrap 컨테이너 안에 표시 when 태그가 여러 개`
- [x] TI1 `[정상] TagInput — should "태그 추가" 버튼만 보이고 입력창은 숨김 when isOpen이 false`
- [x] TI2 `[정상] TagInput — should 버튼명이 "닫기"로 바뀌고 입력창이 보임 when isOpen이 true`
- [x] TI3 `[정상] TagInput — should onToggle을 호출 when 토글 버튼을 클릭`
- [x] TI4 `[정상] TagInput — should onChange에 입력값을 전달 when 입력창에 타이핑`
- [x] TI5 `[정상] TagInput — should onSubmit을 호출 when 입력창에서 Enter`
- [x] TI6 `[정상] TagInput — should 기본 동작을 취소(preventDefault) when Enter`
- [x] TI7 `[정상] TagInput — should value를 입력창 값으로 표시 when value가 'react' 또는 ''`
- [x] TI8 `[정상] TagInput — should aria-label "태그 입력"을 가진 입력창을 렌더 when isOpen이 true`
- [x] TI9 `[정상] TagInput — should 눈에 띄지 않는 회색 계열 토큰 클래스를 토글 버튼에 적용 when 렌더`

**경계**

- [x] TL3 `[경계] TagList — should 아무것도 렌더하지 않음 when tags가 빈 배열`
- [x] TI10 `[경계] TagInput — should onSubmit을 호출하지 않음 when Enter 이외의 키를 입력`
- [x] TI11 `[경계] TagInput — should onSubmit을 호출하지 않음 when 한글 등 IME 조합 중(isComposing)에 Enter` (AC 밖 제안, 개발자 승인으로 포함)

### NoteEditor (통합: api mock 또는 NotesProvider)

**정상**

- [x] E1 `[정상] NoteEditor — should 제목 입력 바로 아래에 "태그 추가" 버튼을 표시 when 기존 노트를 선택`
- [x] E2 `[정상] NoteEditor — should 태그 입력창을 열고 버튼명을 "닫기"로 바꿈 when "태그 추가"를 클릭`
- [x] E3 `[정상] NoteEditor — should 입력창을 닫고 "태그 추가"로 되돌림 when "닫기"를 클릭`
- [x] E4 `[정상] NoteEditor — should trim된 태그를 입력 영역 아래에 표시하고 입력창을 비운 채 열어 둠 when 입력창에서 Enter`
- [x] E5 `[정상] NoteEditor — should 입력한 순서대로 태그를 표시 when 'react', 'design'을 연속 추가`
- [x] E6 `[정상] NoteEditor — should updateNote를 { title, content, tags }로 호출 when 태그를 추가하고 "저장"을 클릭`
- [x] E7 `[정상] NoteEditor — should 저장 후 다시 연 노트에 tags를 표시 when 저장이 성공한 뒤 다른 노트를 거쳐 다시 선택`
- [x] E8 `[정상] NoteEditor — should title, content, tags를 선택한 노트 값으로 리셋하고 이전 노트의 미저장 태그를 섞지 않음 when 다른 노트를 선택`
- [x] E9 `[정상] NoteEditor — should 입력창을 닫고 입력 중이던 텍스트를 초기화 when 입력창을 열어 둔 채 다른 노트를 선택`

**경계**

- [x] E10 `[경계] NoteEditor — should 태그를 추가하지 않고 메시지도 표시하지 않음 when 빈 값이나 공백만 입력하고 Enter`
- [x] E11 `[경계] NoteEditor — should 태그 목록 영역에 아무것도 표시하지 않음 when 노트에 태그가 없음`
- [x] E12 `[경계] NoteEditor — should 에러 없이 열리고 태그 목록이 비어 있음 when tags 필드가 없는 기존 노트를 선택`
- [x] E13 `[경계] NoteEditor — should 에러 없이 저장하고 tags: []로 호출 when tags 필드가 없는 노트의 제목만 수정하고 저장`
- [x] E16 `[경계] NoteEditor — should 이전 노트의 태그를 지우고 태그 목록 영역을 비움 when 태그가 있는 노트(test-2)에서 tags 필드가 없는 노트(test-3)로 전환` (ac-verifier 제안, 개발자 승인으로 포함)
- [x] E17 `[경계] NoteEditor — should 이전 노트의 미저장 태그가 남지 않음 when 노트 선택이 해제(selectedNoteId null)된 뒤 다른 노트를 선택` (ac-verifier 제안, 개발자 승인으로 포함)

**예외**

- [x] E14 `[예외] NoteEditor — should 편집 중인 tags를 유지하고 onDone을 호출하지 않음 when updateNote가 reject`
- [x] E15 `[예외] NoteEditor — should updateNote를 호출하지 않음 when 태그를 추가했지만 제목이 비어 있음`

### api.updateNote / NotesContext.updateNote

**정상**

- [x] A1 `[정상] api.updateNote — should PATCH 본문에 tags를 포함 when updates에 tags를 전달`
- [x] X1 `[정상] NotesContext.updateNote — should notes 배열의 해당 노트를 서버 응답(tags 포함)으로 교체 when tags를 포함한 updates를 전달`

**예외**

- [x] A2 `[예외] api.updateNote — should Error('Failed to update note')를 던짐 when 응답이 !res.ok`

## AC 커버리지

이슈 #2의 완료조건 11개와 대조한 결과이다.

| #   | AC                                                                                                                           | 시나리오                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 1   | 제목 입력 바로 아래에 회색 계열의 "태그 추가" 버튼이 있다                                                                    | E1, TI1, TI9                  |
| 2   | 버튼을 누르면 입력창이 나타나고 "닫기"로 바뀐다. "닫기"를 누르면 "태그 추가"로 돌아온다                                      | TI1, TI2, TI3, H2, H3, E2, E3 |
| 3   | Enter를 누르면 trim된 태그가 한 개 추가되고 폼 submit이 일어나지 않는다                                                      | V1, H5, TI5, TI6, E4          |
| 4   | 추가 후 입력창은 비워지고 열린 상태를 유지한다(연속 입력)                                                                    | H5, H6, TI7, E4, E5           |
| 5   | 빈 값 또는 공백만 입력하고 Enter를 눌러도 태그가 추가되지 않고 메시지도 없다                                                 | V3, V4, V6, H8, H9, E10       |
| 6   | 추가된 태그가 `flex-wrap`으로 실시간 표시되고, 없으면 아무것도 표시하지 않는다                                               | TL1, TL2, TL3, E4, E5, E11    |
| 7   | "저장" 시 PATCH 페이로드에 `title`, `content`, `tags`가 포함되고 응답 후 Context 배열이 갱신된다                             | E6, A1, X1                    |
| 8   | 저장한 노트를 다시 열면 `tags`가 그대로 표시된다                                                                             | E7                            |
| 9   | `tags`가 없는 기존 노트를 열고 저장해도 에러가 나지 않는다                                                                   | H10, E12, E13                 |
| 10  | 노트 전환 시 `title`, `content`, `tags`가 리셋되고 입력창이 닫히며 입력 텍스트가 초기화되고 이전 노트의 태그가 섞이지 않는다 | H7, H11, H12, E8, E9, E16, E17 |
| 11  | 태그 입력창에 `aria-label`이 있다                                                                                            | TI8                           |

AC 밖에서 시그니처의 에러 케이스를 반영한 시나리오(E14, E15, A2)와 승인된 제안(TI11, E16, E17)도 포함했다. 생성 모드에서 태그 UI를 숨기는 결정은 시그니처에 남기고 시나리오로는 만들지 않았다.
