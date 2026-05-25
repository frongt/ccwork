# 단위 테스트 명세: 태그 기능

**기준 문서:** `prd-tag-feature.md`, `adr-tag-feature.md`
**테스트 프레임워크:** Vitest + @testing-library/react + @testing-library/user-event
**테스트 파일 위치:** `src/components/__tests__/TagInput.test.tsx`, `src/components/shared/__tests__/Tag.test.tsx`
**방법론:** Red → Green → Refactor (TDD)

---

## TDD 사이클 범례

| 단계 | 의미 |
|------|------|
| 🔴 Red | 테스트 먼저 작성 — 구현 없으므로 반드시 실패 |
| 🟢 Green | 테스트를 통과시키는 최소한의 구현 |
| 🔵 Refactor | 동작을 유지하면서 코드 품질 개선 |

---

## 1. `TagInput` 컴포넌트

**테스트 파일:** `src/components/__tests__/TagInput.test.tsx`

### 공통 테스트 헬퍼

```tsx
// src/components/__tests__/TagInput.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from '../TagInput';

// react-hot-toast 모킹 — DOM 없는 jsdom에서 Toast 사이드이펙트 제거
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
}));
import toast from 'react-hot-toast';

function setup(tags: string[] = [], onChange = vi.fn()) {
  const user = userEvent.setup();
  const { rerender } = render(<TagInput tags={tags} onChange={onChange} />);
  return { user, onChange, rerender };
}
```

---

### T-U-01: 초기 렌더링 — `+` 버튼 표시

**근거:** PRD US-01 — `+` 버튼이 태그 목록 끝에 보여야 한다.

```tsx
it('태그 목록 끝에 + 버튼을 렌더링한다', () => {
  // 🔴 Red: TagInput이 존재하지 않으면 import 에러로 실패
  setup();
  expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
});
```

🔴 **실패 이유:** `TagInput.tsx` 파일 없음 → import 실패
🟢 **Green 구현:** `+` 버튼이 있는 최소 컴포넌트 반환
🔵 **Refactor:** `isAdding` 상태 추가, 조건부 렌더링 구조화

---

### T-U-02: 태그 배열이 배지로 렌더링됨

**근거:** PRD US-05 — 태그가 있으면 배지로 표시되어야 한다.

```tsx
it('전달받은 tags를 배지로 렌더링한다', () => {
  // 🔴 Red: 렌더링 로직 없으면 배지 텍스트 못 찾음
  setup(['react', 'typescript']);

  expect(screen.getByText('react')).toBeInTheDocument();
  expect(screen.getByText('typescript')).toBeInTheDocument();
});
```

🔴 **실패 이유:** `tags.map()` 렌더링 없음
🟢 **Green 구현:** `tags.map((tag) => <span key={tag}>{tag}</span>)` 추가
🔵 **Refactor:** 각 배지에 클릭 핸들러, `×` 버튼 추가

---

### T-U-03: 빈 배열일 때 배지 미렌더링

**근거:** PRD US-05 — 태그 없으면 배지 영역이 렌더링되지 않아야 한다.

```tsx
it('tags가 빈 배열이면 + 버튼만 렌더링한다', () => {
  setup([]);

  expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
});
```

🔴 **실패 이유:** 빈 상태 분기 없음
🟢 **Green 구현:** `tags.length === 0` 조건 없이도 `map` 빈 배열이면 자연스럽게 통과
🔵 **Refactor:** 특별한 처리 불필요, 현 구조 유지

---

### T-U-04: `+` 버튼 클릭 → 입력 필드 표시

**근거:** PRD US-01 — `+` 클릭 시 인라인 입력 필드가 나타나야 한다.

```tsx
it('+ 버튼을 클릭하면 태그 입력 필드가 나타난다', async () => {
  // 🔴 Red: isAdding 상태와 조건부 렌더링 없으면 실패
  const { user } = setup();

  await user.click(screen.getByRole('button', { name: '+' }));

  expect(screen.getByPlaceholderText('태그 입력')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '+' })).not.toBeInTheDocument();
});
```

🔴 **실패 이유:** `isAdding` 상태, 조건부 렌더링 미구현
🟢 **Green 구현:** `setIsAdding(true)`, 입력 필드 조건부 렌더링
🔵 **Refactor:** `autoFocus` 추가, 스타일 적용

---

### T-U-05: Enter 키로 태그 추가 확정

**근거:** PRD US-01 수용 기준 — Enter 키로 확정.

```tsx
it('입력 후 Enter를 누르면 onChange가 새 태그 배열로 호출된다', async () => {
  // 🔴 Red: handleConfirm, handleKeyDown 미구현
  const { user, onChange } = setup(['기존태그']);

  await user.click(screen.getByRole('button', { name: '+' }));
  await user.type(screen.getByPlaceholderText('태그 입력'), '신규태그');
  await user.keyboard('{Enter}');

  expect(onChange).toHaveBeenCalledWith(['기존태그', '신규태그']);
});
```

🔴 **실패 이유:** `onKeyDown` 핸들러, `handleConfirm` 없음
🟢 **Green 구현:** `handleKeyDown`에서 `key === 'Enter'` 시 `handleConfirm` 호출
🔵 **Refactor:** `e.preventDefault()` 추가하여 form submit 방지

---

### T-U-06: Escape 키로 취소

**근거:** PRD US-01 수용 기준 — Esc 입력 시 취소.

```tsx
it('입력 중 Escape를 누르면 입력 필드가 닫히고 onChange는 호출되지 않는다', async () => {
  // 🔴 Red: Esc 핸들링 없음
  const { user, onChange } = setup();

  await user.click(screen.getByRole('button', { name: '+' }));
  await user.type(screen.getByPlaceholderText('태그 입력'), '임시태그');
  await user.keyboard('{Escape}');

  expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  expect(onChange).not.toHaveBeenCalled();
});
```

🔴 **실패 이유:** `key === 'Escape'` 분기 없음
🟢 **Green 구현:** `handleCancel` 함수 — `setIsAdding(false)`, `setInputValue('')`
🔵 **Refactor:** `handleCancel`을 editing 취소에도 재사용

---

### T-U-07: 빈 값으로 Enter — 취소 처리

**근거:** PRD 기능 명세 — 빈 문자열 입력 시 취소.

```tsx
it('빈 값으로 Enter를 누르면 태그가 추가되지 않고 필드가 닫힌다', async () => {
  // 🔴 Red: trim() 후 빈값 검사 없음
  const { user, onChange } = setup();

  await user.click(screen.getByRole('button', { name: '+' }));
  await user.keyboard('{Enter}');

  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
});
```

🔴 **실패 이유:** `value.trim()` 검사 없이 빈 값도 `onChange` 호출
🟢 **Green 구현:** `if (!value) { handleCancel(); return; }`
🔵 **Refactor:** 공백만 있는 경우도 처리 (`'   '.trim() === ''`)

---

### T-U-08: 중복 태그 → Toast 에러, 필드 유지

**근거:** PRD US-04 — 중복 감지 시 Toast 에러, 입력 필드 유지.

```tsx
it('이미 존재하는 태그를 추가하면 toast.error를 호출하고 필드를 유지한다', async () => {
  // 🔴 Red: 중복 검사 로직 없음
  const { user, onChange } = setup(['react']);

  await user.click(screen.getByRole('button', { name: '+' }));
  await user.type(screen.getByPlaceholderText('태그 입력'), 'react');
  await user.keyboard('{Enter}');

  expect(toast.error).toHaveBeenCalledWith('이미 존재하는 태그입니다.');
  expect(onChange).not.toHaveBeenCalled();
  // 필드가 닫히지 않고 유지됨
  expect(screen.getByPlaceholderText('태그 입력')).toBeInTheDocument();
});
```

🔴 **실패 이유:** `tags.includes(value)` 검사 없음
🟢 **Green 구현:** `if (tags.includes(value)) { toast.error(...); return; }`
🔵 **Refactor:** 메시지 상수(`DUPLICATE_TAG_MSG`)로 분리하여 재사용

---

### T-U-09: blur 시 태그 확정

**근거:** PRD US-01 — blur 시 확정.

```tsx
it('입력 필드에서 포커스가 벗어나면(blur) 태그가 확정된다', async () => {
  // 🔴 Red: onBlur 핸들러 없음
  const { user, onChange } = setup();

  await user.click(screen.getByRole('button', { name: '+' }));
  await user.type(screen.getByPlaceholderText('태그 입력'), '새태그');
  await user.tab(); // blur 발생

  expect(onChange).toHaveBeenCalledWith(['새태그']);
});
```

🔴 **실패 이유:** `onBlur={handleConfirm}` 없음
🟢 **Green 구현:** `<input onBlur={handleConfirm} />`
🔵 **Refactor:** double-fire 방지 (Enter + blur 동시 발생 케이스 주의)

---

### T-U-10: 태그 배지 클릭 → 편집 모드 진입

**근거:** PRD US-02 — 기존 태그 클릭 시 인라인 편집 필드로 전환.

```tsx
it('태그 배지를 클릭하면 해당 배지가 편집 입력 필드로 전환된다', async () => {
  // 🔴 Red: handleTagClick, editingIndex 상태 없음
  const { user } = setup(['react']);

  await user.click(screen.getByText('react'));

  // 배지 텍스트 대신 입력 필드가 보여야 함
  expect(screen.getByDisplayValue('react')).toBeInTheDocument();
  expect(screen.queryByText('react')).not.toBeInTheDocument();
});
```

🔴 **실패 이유:** `editingIndex` 상태, 클릭 핸들러 없음
🟢 **Green 구현:** `handleTagClick(index)` — `setEditingIndex(index)`, `setInputValue(tags[index])`
🔵 **Refactor:** 편집 전환 시 `isAdding` 초기화 (`setIsAdding(false)`)

---

### T-U-11: 편집 모드에서 기존 값 채워짐

**근거:** PRD US-02 — 기존 태그 텍스트가 입력 필드에 미리 채워져야 한다.

```tsx
it('태그 배지를 클릭하면 입력 필드에 기존 태그 값이 채워진다', async () => {
  // 🔴 Red: inputValue가 tags[index]로 초기화되지 않음
  const { user } = setup(['typescript']);

  await user.click(screen.getByText('typescript'));

  expect(screen.getByDisplayValue('typescript')).toBeInTheDocument();
});
```

🔴 **실패 이유:** `setInputValue(tags[index])` 없음
🟢 **Green 구현:** `handleTagClick`에서 `setInputValue(tags[index])` 호출
🔵 **Refactor:** T-U-10과 동일 핸들러 — 별도 테스트이지만 구현은 하나

---

### T-U-12: 편집 후 Enter — 변경 확정

**근거:** PRD US-02 수용 기준 — Enter 시 변경 내용 확정.

```tsx
it('편집 모드에서 값을 바꾸고 Enter를 누르면 onChange가 수정된 배열로 호출된다', async () => {
  // 🔴 Red: editingIndex 분기 없음
  const { user, onChange } = setup(['react', 'vue']);

  await user.click(screen.getByText('vue'));
  await user.clear(screen.getByDisplayValue('vue'));
  await user.type(screen.getByDisplayValue(''), 'svelte');
  await user.keyboard('{Enter}');

  expect(onChange).toHaveBeenCalledWith(['react', 'svelte']);
});
```

🔴 **실패 이유:** `if (editingIndex !== null)` 분기에서 `onChange(tags.map(...))` 없음
🟢 **Green 구현:** `onChange(tags.map((t, i) => (i === editingIndex ? value : t)))`
🔵 **Refactor:** `editingIndex`를 `setEditingIndex(null)`로 초기화

---

### T-U-13: 편집 모드에서 Escape — 원본 유지

**근거:** PRD US-02 — Esc 시 취소, 원래 값 유지.

```tsx
it('편집 중 Escape를 누르면 onChange가 호출되지 않고 원래 태그가 유지된다', async () => {
  // 🔴 Red: Esc 취소 시 editingIndex 초기화 없음
  const { user, onChange } = setup(['react']);

  await user.click(screen.getByText('react'));
  await user.clear(screen.getByDisplayValue('react'));
  await user.type(screen.getByDisplayValue(''), 'different');
  await user.keyboard('{Escape}');

  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByText('react')).toBeInTheDocument();
});
```

🔴 **실패 이유:** `handleCancel`이 `editingIndex`도 초기화하지 않음
🟢 **Green 구현:** `handleCancel`에서 `setEditingIndex(null)` 추가
🔵 **Refactor:** `isAdding`/`editingIndex` 둘 다 처리하는 통합 cancel 함수

---

### T-U-14: 편집 중 다른 태그와 중복 → Toast

**근거:** PRD US-04, ADR-001-E.

```tsx
it('편집 시 다른 태그와 동일한 값이면 toast.error를 호출한다', async () => {
  // 🔴 Red: 편집 중복 검사 없음 (추가 중복만 검사)
  const { user, onChange } = setup(['react', 'vue']);

  await user.click(screen.getByText('vue'));
  await user.clear(screen.getByDisplayValue('vue'));
  await user.type(screen.getByDisplayValue(''), 'react'); // 이미 존재
  await user.keyboard('{Enter}');

  expect(toast.error).toHaveBeenCalledWith('이미 존재하는 태그입니다.');
  expect(onChange).not.toHaveBeenCalled();
});
```

🔴 **실패 이유:** `isDuplicate = tags.some((t, i) => i !== editingIndex && t === value)` 검사 없음
🟢 **Green 구현:** 편집 분기에 중복 검사 추가 (자기 자신 인덱스 제외)
🔵 **Refactor:** 추가/편집 중복 검사 로직을 `isDuplicate(value, excludeIndex?)` 헬퍼로 추출

---

### T-U-15: `×` 버튼으로 태그 삭제

**근거:** PRD US-03 — `×` 클릭 시 해당 태그가 즉시 제거.

```tsx
it('× 버튼을 클릭하면 해당 태그가 제거된다', async () => {
  // 🔴 Red: handleDelete, × 버튼 없음
  const { user, onChange } = setup(['react', 'vue']);

  const deleteButtons = screen.getAllByRole('button', { name: '×' });
  await user.click(deleteButtons[0]); // 'react' 삭제

  expect(onChange).toHaveBeenCalledWith(['vue']);
});
```

🔴 **실패 이유:** `×` 버튼, `handleDelete` 없음
🟢 **Green 구현:** `onChange(tags.filter((_, i) => i !== index))`
🔵 **Refactor:** 버튼 `aria-label` 추가 (`삭제: react`)로 접근성 개선

---

### T-U-16: `×` 클릭이 편집 모드를 열지 않음 (stopPropagation)

**근거:** ADR-001-B, PRD US-03 — 이벤트 버블링 차단.

```tsx
it('× 버튼 클릭이 배지 클릭(편집 모드 진입)으로 전파되지 않는다', async () => {
  // 🔴 Red: e.stopPropagation() 없으면 편집 모드도 동시에 진입
  const { user } = setup(['react']);

  const deleteButton = screen.getByRole('button', { name: '×' });
  await user.click(deleteButton);

  // 편집 input이 나타나지 않아야 함
  expect(screen.queryByDisplayValue('react')).not.toBeInTheDocument();
});
```

🔴 **실패 이유:** `e.stopPropagation()` 없음
🟢 **Green 구현:** `handleDelete`에서 첫 줄 `e.stopPropagation()` 추가
🔵 **Refactor:** 추가 처리 불필요

---

### T-U-17: 편집 중인 태그의 `×` 클릭 — 편집 상태 초기화

**근거:** PRD US-03 — 편집 중인 태그 삭제 시 편집 상태도 함께 초기화.

```tsx
it('편집 중인 태그의 × 버튼을 클릭하면 편집 상태가 초기화된다', async () => {
  // 🔴 Red: handleDelete에서 editingIndex 초기화 없음
  const { user } = setup(['react']);

  await user.click(screen.getByText('react')); // 편집 모드 진입
  const deleteButton = screen.getByRole('button', { name: '×' });
  await user.click(deleteButton);

  // 편집 input이 사라지고 + 버튼이 다시 보여야 함
  expect(screen.queryByDisplayValue('react')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
});
```

🔴 **실패 이유:** `if (editingIndex === index) { setEditingIndex(null); ... }` 없음
🟢 **Green 구현:** `handleDelete`에서 편집 중인 인덱스 초기화 분기 추가
🔵 **Refactor:** 추가 처리 불필요

---

## 2. `Tag` 공용 컴포넌트

**테스트 파일:** `src/components/shared/__tests__/Tag.test.tsx`

### T-U-18: label 텍스트 렌더링

```tsx
import { render, screen } from '@testing-library/react';
import { Tag } from '../Tag';

it('label prop의 텍스트를 렌더링한다', () => {
  // 🔴 Red: Tag 컴포넌트 없음
  render(<Tag label="typescript" />);
  expect(screen.getByText('typescript')).toBeInTheDocument();
});
```

🔴 **실패 이유:** `Tag.tsx` 없음
🟢 **Green 구현:** `<span>{label}</span>` 최소 반환
🔵 **Refactor:** `clsx('tag', ...)` 클래스 적용

---

### T-U-19: color prop → CSS 클래스 적용

**근거:** ADR-001-D — `tag-{color}` 클래스가 6종 팔레트에 매핑되어야 한다.

```tsx
it.each([
  ['indigo'],
  ['violet'],
  ['teal'],
  ['amber'],
  ['rose'],
  ['slate'],
] as const)('color="%s"일 때 tag-%s 클래스가 적용된다', (color) => {
  // 🔴 Red: color → className 매핑 없음
  render(<Tag label="test" color={color} />);
  expect(screen.getByText('test')).toHaveClass(`tag-${color}`);
});
```

🔴 **실패 이유:** `className={clsx('tag', 'tag-${color}')}` 없음
🟢 **Green 구현:** `clsx('tag', \`tag-${color}\`)` 적용
🔵 **Refactor:** TypeScript `TagColor` 유니온으로 잘못된 color 컴파일 타임 차단

---

### T-U-20: 기본 color는 `indigo`

**근거:** PRD §4.3, ADR-001-D.

```tsx
it('color prop 미전달 시 기본값 indigo 클래스가 적용된다', () => {
  // 🔴 Red: default parameter 없음
  render(<Tag label="test" />);
  expect(screen.getByText('test')).toHaveClass('tag-indigo');
});
```

🔴 **실패 이유:** `color = 'indigo'` 기본값 없음
🟢 **Green 구현:** `color = 'indigo'` 기본 파라미터
🔵 **Refactor:** 추가 처리 불필요

---

## 3. `NotesContext` — 태그 포함 addNote / editNote

**테스트 파일:** `src/context/__tests__/NotesContext.test.tsx`

### 공통 모킹

```tsx
vi.mock('../api/notes');
import * as api from '../api/notes';
```

### T-U-21: addNote에 tags 포함하여 API 호출

**근거:** ADR-001-C — 저장 시 tags 배열이 함께 전달된다.

```tsx
it('addNote 호출 시 tags를 포함하여 api.createNote를 호출한다', async () => {
  // 🔴 Red: addNote 시그니처에 tags 파라미터 없음
  vi.mocked(api.createNote).mockResolvedValue({
    id: '1', title: 'test', content: '', tags: ['react'],
    createdAt: '', updatedAt: '',
  });

  const { result } = renderHook(() => useNotes(), { wrapper: NotesProvider });
  await act(async () => {
    await result.current.addNote('test', '', ['react']);
  });

  expect(api.createNote).toHaveBeenCalledWith(
    expect.objectContaining({ tags: ['react'] })
  );
});
```

🔴 **실패 이유:** `addNote(title, content)` — tags 파라미터 없음
🟢 **Green 구현:** `addNote(title, content, tags)` 시그니처 확장
🔵 **Refactor:** `NotesContextType` 인터페이스 타입 정의 업데이트

---

### T-U-22: editNote에 tags 포함하여 API 호출

```tsx
it('editNote 호출 시 tags를 포함하여 api.updateNote를 호출한다', async () => {
  // 🔴 Red: editNote가 tags를 updates에 포함하지 않으면 실패
  vi.mocked(api.updateNote).mockResolvedValue({
    id: '1', title: 'test', content: '', tags: ['vue'],
    createdAt: '', updatedAt: '',
  });

  const { result } = renderHook(() => useNotes(), { wrapper: NotesProvider });
  await act(async () => {
    await result.current.editNote('1', { tags: ['vue'] });
  });

  expect(api.updateNote).toHaveBeenCalledWith(
    '1',
    expect.objectContaining({ tags: ['vue'] })
  );
});
```

🔴 **실패 이유:** `updateNote`가 `tags` 필드를 받지 않으면 실패
🟢 **Green 구현:** `editNote`의 `updates: Partial<Note>` — `tags` 자동 포함
🔵 **Refactor:** 추가 처리 불필요 (Partial<Note>로 이미 tags 포함됨)

---

## 테스트 실행 커버리지 목표

| 영역 | 테스트 수 | 커버리지 목표 |
|------|----------|--------------|
| `TagInput` 렌더링 | 3 | 100% |
| `TagInput` 추가 흐름 | 5 | 100% |
| `TagInput` 편집 흐름 | 5 | 100% |
| `TagInput` 삭제 흐름 | 3 | 100% |
| `Tag` 공용 컴포넌트 | 3 | 100% |
| `NotesContext` 태그 전달 | 2 | 핵심 경로 |
| **합계** | **21** | — |

---

## 미구현 스펙 — 추가 테스트 필요

다음 PRD 명세는 현재 코드에 구현되지 않아 **테스트 작성 시 먼저 Red로 실패함을 확인하고 구현이 선행**되어야 한다.

### T-U-미구현-01: 태그 최대 길이 10자 제한

```tsx
it('11자 이상의 태그를 입력하면 onChange가 호출되지 않는다', async () => {
  // 🔴 Red: 길이 검증 없으므로 반드시 실패
  const { user, onChange } = setup();

  await user.click(screen.getByRole('button', { name: '+' }));
  await user.type(screen.getByPlaceholderText('태그 입력'), '열한글자초과태그값');
  await user.keyboard('{Enter}');

  expect(onChange).not.toHaveBeenCalled();
  // 또는 toast.error가 호출되어야 함
});
```

> **구현 필요:** `handleConfirm`에서 `value.length > 10` 검사 추가
