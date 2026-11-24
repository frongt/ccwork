# 이슈 2. 태그를 삭제한다 (긴 태그 말줄임 포함) — 테스트 시나리오

> GitHub 이슈: #3 / 기준 문서: prd.md, spec-fixed.md / 선행: 이슈 1(`issue-1.md`)

## 시그니처

선언만 기록한다. 이슈 1의 시그니처 중 변경되는 부분만 적는다.

### src/components/Tag.tsx (수정, 표현)

```ts
interface TagProps {
  label: string;
  onDelete: () => void; // x 버튼 클릭 시. 어떤 태그인지는 부모(TagList)가 바인딩한다
}

export declare function Tag(props: TagProps): JSX.Element;
```

`title={label}`, `truncate`, 최대 너비, `aria-label="{label} 태그 삭제"`는 컴포넌트 내부에 고정한다.

### src/components/TagList.tsx (수정, 표현)

```ts
interface TagListProps {
  tags: string[];
  onDelete: (index: number) => void; // Tag의 onDelete를 () => onDelete(index)로 연결
}

export declare function TagList(props: TagListProps): JSX.Element | null; // 빈 배열이면 null
```

### src/hooks/useTagEditor.ts (수정, 상태)

```ts
export interface UseTagEditorResult {
  // ...이슈 1과 동일
  removeTag: (index: number) => void; // 신규. tags에서 해당 위치의 태그를 제거한다
}
```

### 변경되지 않는 시그니처

- `validateTag`, `TagInput`, `NoteEditorProps`, `api.updateNote`, `NotesContext.updateNote`는 이슈 1과 같다.
- `NoteEditor`는 `TagList`에 `onDelete={removeTag}`만 연결한다. 삭제도 저장 시 `updateNote(id, { title, content, tags })`로 반영한다.

### 확정된 결정

- `removeTag`는 인덱스로 지운다. 이슈 3 전에는 중복 태그가 가능하므로 같은 문자열을 모두 지우지 않기 위해서다.
- `Tag.onDelete`는 인자 없는 `() => void`이고, 바인딩은 `TagList`가 맡는다.

### 에러 케이스

- `removeTag`에 범위 밖 인덱스(음수, `tags.length` 이상) → 던지지 않고 `tags`를 바꾸지 않는다.
- `Tag`, `TagList`, `removeTag`는 던지지 않는다.
- `NoteEditor` 저장 실패 → 이슈 1과 같다. `tags`를 유지하고 `onDone`을 호출하지 않는다.

## 테스트 시나리오

형식: `[분류] 대상 — should 기대동작 when 조건`. 앞의 ID는 아래 AC 커버리지 표에서 참조한다.

### Tag (props 기반 컴포넌트)

**정상**

- [ ] T1 `[정상] Tag — should label 텍스트를 표시 when label이 'react'`
- [ ] T2 `[정상] Tag — should 삭제 버튼을 DOM에 렌더 when 항상 (표시 여부와 무관)`
- [ ] T3 `[정상] Tag — should 삭제 버튼에 aria-label "react 태그 삭제"를 가짐 when label이 'react'`
- [ ] T4 `[정상] Tag — should onDelete를 한 번 호출 when 삭제 버튼을 클릭`
- [ ] T5 `[정상] Tag — should 삭제 버튼이 평소 투명하고 group-hover·focus 때 보이는 클래스를 가짐 when 렌더`
- [ ] T6 `[정상] Tag — should title 속성에 전체 label을 가짐 when 렌더`
- [ ] T7 `[정상] Tag — should 최대 너비 제한 클래스와 라벨에 truncate 클래스를 가짐 when 렌더`

**경계**

- [ ] T8 `[경계] Tag — should 라벨이 50자여도 삭제 버튼이 라벨 밖 영역에 렌더되어 잘리지 않음 when label이 50자 문자열 (라벨만 truncate, 버튼은 shrink-0)`
- [ ] T9 `[경계] Tag — should 클릭해도 onDelete 외의 동작을 하지 않음 when 라벨 영역을 클릭`

### TagList (props 기반 컴포넌트)

**정상**

- [ ] TL1 `[정상] TagList — should 각 태그에 삭제 버튼을 표시 when tags가 ['react', 'design']`
- [ ] TL2 `[정상] TagList — should onDelete에 해당 태그의 인덱스를 전달 when 두 번째 태그의 삭제 버튼을 클릭 (1)`
- [ ] TL3 `[정상] TagList — should flex-wrap 컨테이너 안에 표시 when 50자 태그가 여러 개 (가로 스크롤 유발 클래스 없음)`

**경계**

- [ ] TL4 `[경계] TagList — should 아무것도 렌더하지 않음 when tags가 빈 배열 (모두 삭제된 상태)`
- [ ] TL5 `[경계] TagList — should 중복 태그도 각자 자기 인덱스를 전달 when tags가 ['a', 'a']에서 두 번째 삭제`

### useTagEditor (renderHook)

**정상**

- [ ] H1 `[정상] removeTag — should 해당 인덱스의 태그만 제거 when tags가 ['a', 'b', 'c']에서 1을 전달`
- [ ] H2 `[정상] removeTag — should 나머지 태그의 순서를 유지 when 중간 태그를 제거`
- [ ] H3 `[정상] removeTag — should isInputOpen과 inputValue를 바꾸지 않음 when 입력 중에 태그를 제거`

**경계**

- [ ] H4 `[경계] removeTag — should 첫 번째 태그만 제거 when 인덱스 0`
- [ ] H5 `[경계] removeTag — should 마지막 태그만 제거 when 인덱스 tags.length-1`
- [ ] H6 `[경계] removeTag — should tags가 [] when 하나뿐인 태그를 제거`
- [ ] H7 `[경계] removeTag — should 같은 위치의 태그 하나만 제거 when 중복 태그 ['a', 'a']에서 0을 전달`
- [ ] H8 `[경계] removeTag — should reset에 전달한 initialTags 배열을 변경하지 않음 when reset 후 태그를 제거`

**예외**

- [ ] H9 `[예외] removeTag — should 던지지 않고 tags를 바꾸지 않음 when 인덱스가 tags.length 이상`
- [ ] H10 `[예외] removeTag — should 던지지 않고 tags를 바꾸지 않음 when 인덱스가 음수`

### NoteEditor (통합: api mock 또는 NotesProvider)

**정상**

- [ ] E1 `[정상] NoteEditor — should 클릭한 태그가 목록에서 즉시 사라지고 나머지는 남음 when 태그가 있는 노트에서 삭제 버튼을 클릭`
- [ ] E2 `[정상] NoteEditor — should updateNote를 삭제된 tags를 포함한 { title, content, tags }로 호출 when 태그를 삭제하고 "저장"을 클릭`
- [ ] E3 `[정상] NoteEditor — should 삭제 시점에는 updateNote를 호출하지 않음 when 삭제 버튼만 클릭 (저장 전 서버 미반영)`
- [ ] E4 `[정상] NoteEditor — should 삭제가 버려지고 원래 태그가 표시되며 확인창이 뜨지 않음 when 태그를 삭제한 뒤 저장하지 않고 다른 노트로 갔다가 돌아옴`
- [ ] E5 `[정상] NoteEditor — should 저장한 삭제 결과를 표시 when 저장 후 다른 노트를 거쳐 다시 선택`
- [ ] E6 `[정상] NoteEditor — should 방금 추가한 태그도 삭제 가능 when 입력창에서 추가한 태그의 삭제 버튼을 클릭`

**경계**

- [ ] E7 `[경계] NoteEditor — should 태그 목록 영역에 아무것도 표시하지 않음 when 모든 태그를 삭제`
- [ ] E8 `[경계] NoteEditor — should tags: []로 updateNote를 호출 when 모든 태그를 삭제하고 저장`

**예외**

- [ ] E9 `[예외] NoteEditor — should 삭제된 상태의 tags를 유지하고 onDone을 호출하지 않음 when 삭제 후 저장 중 updateNote가 reject`

## AC 커버리지

이슈 #3의 완료조건 10개와 대조한 결과이다.

| #   | AC                                                                             | 시나리오                                                                                                        |
| --- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | 각 태그에 삭제용 `x` 버튼이 DOM에 항상 존재한다                                | T2, TL1                                                                                                         |
| 2   | 평소 투명, 마우스 올리거나(`group-hover`) 키보드 포커스(`focus`)가 오면 보인다 | T5 (jsdom은 CSS 상태를 못 그리므로 클래스 존재로 검증)                                                          |
| 3   | `aria-label="{태그명} 태그 삭제"`가 있다                                       | T3                                                                                                              |
| 4   | `onDelete`로 부모에 위임, 클릭하면 즉시 사라진다                               | T4, TL2, H1~H7, E1, E6                                                                                          |
| 5   | 저장 시 서버에 반영, 저장 전 노트를 전환하면 버려진다(확인창 없음)             | E2, E3, E4, E5                                                                                                  |
| 6   | 모두 삭제하면 목록 영역에 아무것도 표시하지 않는다                             | H6, TL4, E7                                                                                                     |
| 7   | 최대 너비 설정, 넘치는 라벨은 `truncate` 말줄임                                | T7                                                                                                              |
| 8   | `title` 속성에 전체 태그 이름                                                  | T6                                                                                                              |
| 9   | 말줄임이어도 `x` 버튼이 잘리지 않고 접근 가능                                  | T8 (jsdom은 레이아웃 계산이 안 되므로 버튼이 truncate 영역 밖 형제 요소이고 shrink 방지 클래스가 있는지로 검증) |
| 10  | 50자 태그 여러 개가 `flex-wrap`으로 줄바꿈, 가로 스크롤 없음                   | TL3 (클래스 검증, 실제 레이아웃은 브라우저 수동 확인 대상)                                                      |

AC 밖에서 시그니처의 에러 케이스를 반영한 시나리오(H9, H10)와 보강 시나리오(T9, TL5, H8, E8, E9)도 포함했다. AC 2, 9, 10은 jsdom 한계로 클래스 단위로만 검증하므로 실제 모양은 수동 확인이 필요하다.
