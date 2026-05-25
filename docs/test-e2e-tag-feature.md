# E2E 시나리오 테스트 명세: 태그 기능

**기준 문서:** `prd-tag-feature.md`, `adr-tag-feature.md`
**테스트 프레임워크:** Playwright (미설치 — 설치 명령: `pnpm add -D @playwright/test`)
**테스트 파일 위치:** `e2e/tag-feature.spec.ts`
**환경:** 앱 서버 `localhost:5173` + JSON Server `localhost:3001`
**방법론:** Red → Green → Refactor (TDD)

---

## TDD 사이클 범례

| 단계 | 의미 |
|------|------|
| 🔴 Red | 시나리오 작성 — 기능 미구현으로 반드시 실패 |
| 🟢 Green | 시나리오를 통과하는 최소 구현 |
| 🔵 Refactor | 동작을 유지하면서 구현 품질 개선 |

---

## 사전 조건 (Fixtures)

```ts
// e2e/fixtures/db.ts
export const cleanDb = {
  notes: [
    {
      id: 'e2e-note-1',
      title: 'E2E 테스트용 노트',
      content: '태그 기능 테스트를 위한 노트입니다.',
      tags: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'e2e-note-2',
      title: '태그 있는 노트',
      content: '기존 태그가 있는 노트입니다.',
      tags: ['react', 'typescript'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};
```

```ts
// e2e/tag-feature.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';

test.beforeEach(async () => {
  // 각 테스트 전 db.json을 클린 상태로 초기화
  fs.writeFileSync('./db.json', JSON.stringify(cleanDb, null, 2));
});
```

---

## 시나리오 SC-01: 새 노트 생성 시 태그 추가

**연결 PRD:** US-01, US-05
**연결 ADR:** ADR-001-C (저장 시 일괄 반영)

### 시나리오 흐름

```
사용자 → "+ 새 노트" 클릭
       → 제목 입력
       → "+" 버튼 클릭
       → 태그 입력 → Enter
       → "저장" 클릭
       → 노트 목록에서 태그 배지 확인
       → JSON Server에서 tags 필드 확인
```

### 테스트 코드

```ts
test('SC-01: 새 노트 생성 시 태그를 추가하면 목록 카드에 태그가 표시된다', async ({ page }) => {
  // 🔴 Red: 태그 저장 로직 없으면 목록에서 태그 배지 못 찾음

  await page.goto('http://localhost:5173');

  // 새 노트 생성 진입
  await page.getByRole('button', { name: '+ 새 노트' }).click();
  await page.getByPlaceholder('제목').fill('태그 테스트 노트');

  // 태그 추가
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('태그 입력').fill('playwright');
  await page.keyboard.press('Enter');

  // 두 번째 태그 추가
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('태그 입력').fill('e2e');
  await page.keyboard.press('Enter');

  // 저장
  await page.getByRole('button', { name: '저장' }).click();

  // 목록 카드에서 태그 배지 확인
  const noteCard = page.locator('[data-testid="note-card"]').filter({ hasText: '태그 테스트 노트' });
  await expect(noteCard.getByText('playwright')).toBeVisible();
  await expect(noteCard.getByText('e2e')).toBeVisible();
});
```

```ts
test('SC-01-서버: 저장 후 JSON Server에 tags가 영속화된다', async ({ page, request }) => {
  // 🔴 Red: api.createNote에 tags 미전달 시 서버에 빈 배열로 저장됨

  await page.goto('http://localhost:5173');
  await page.getByRole('button', { name: '+ 새 노트' }).click();
  await page.getByPlaceholder('제목').fill('서버 영속성 테스트');

  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('태그 입력').fill('persistence');
  await page.keyboard.press('Enter');

  await page.getByRole('button', { name: '저장' }).click();
  await page.waitForResponse('**/notes');

  // JSON Server API로 직접 확인
  const response = await request.get('http://localhost:3001/notes');
  const notes = await response.json();
  const created = notes.find((n: { title: string }) => n.title === '서버 영속성 테스트');

  expect(created.tags).toContain('persistence');
});
```

🟢 **Green 조건:** `NoteEditor.handleSave`가 `tags`를 `addNote`에 전달하고, `api.createNote`가 서버에 POST
🔵 **Refactor:** `data-testid` 속성 일관성 확인, 응답 대기 로직 정리

---

## 시나리오 SC-02: 기존 노트 태그 편집 후 저장

**연결 PRD:** US-02
**연결 ADR:** ADR-001-C

### 시나리오 흐름

```
사용자 → 태그 있는 노트 선택
       → 기존 태그 배지 클릭 → 편집 모드
       → 값 변경 → Enter
       → "저장" 클릭
       → 변경된 태그가 목록 카드에 반영됨
```

### 테스트 코드

```ts
test('SC-02: 기존 태그를 편집하면 저장 후 변경된 태그가 반영된다', async ({ page }) => {
  // 🔴 Red: editingIndex 분기 없으면 편집이 아닌 추가로 처리됨

  await page.goto('http://localhost:5173');

  // 태그 있는 노트 선택
  await page.getByText('태그 있는 노트').click();

  // 'react' 태그 배지 클릭 → 편집 모드
  await page.getByText('react').click();
  const editInput = page.getByDisplayValue('react');
  await expect(editInput).toBeVisible();

  // 값 변경
  await editInput.selectText();
  await editInput.fill('nextjs');
  await page.keyboard.press('Enter');

  // 저장
  await page.getByRole('button', { name: '저장' }).click();

  // 목록 카드에서 변경 확인
  const noteCard = page.locator('[data-testid="note-card"]').filter({ hasText: '태그 있는 노트' });
  await expect(noteCard.getByText('nextjs')).toBeVisible();
  await expect(noteCard.getByText('react')).not.toBeVisible();
  await expect(noteCard.getByText('typescript')).toBeVisible(); // 나머지 태그 유지
});
```

🟢 **Green 조건:** `editingIndex` 상태 + `onChange(tags.map(...))` 구현
🔵 **Refactor:** `api.updateNote` PATCH 요청 응답 대기 명시

---

## 시나리오 SC-03: 태그 삭제 후 저장

**연결 PRD:** US-03
**연결 ADR:** ADR-001-C

### 테스트 코드

```ts
test('SC-03: 태그의 × 버튼으로 삭제하면 저장 후 목록에서 사라진다', async ({ page }) => {
  // 🔴 Red: handleDelete 없으면 × 버튼 클릭해도 태그 유지

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  // 편집기에서 'react' 태그의 × 버튼 클릭
  const reactBadge = page.locator('.tag', { hasText: 'react' });
  await reactBadge.getByRole('button', { name: '×' }).click();

  // 편집기에서 즉시 사라짐 확인
  await expect(reactBadge).not.toBeVisible();

  // 저장
  await page.getByRole('button', { name: '저장' }).click();

  // 목록 카드에서도 사라짐 확인
  const noteCard = page.locator('[data-testid="note-card"]').filter({ hasText: '태그 있는 노트' });
  await expect(noteCard.getByText('react')).not.toBeVisible();
  await expect(noteCard.getByText('typescript')).toBeVisible(); // 나머지 태그 유지
});
```

```ts
test('SC-03-이벤트: 태그 × 클릭이 편집 모드를 열지 않는다', async ({ page }) => {
  // 🔴 Red: e.stopPropagation() 없으면 × 클릭 후 편집 input이 나타남

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  const reactBadge = page.locator('.tag', { hasText: 'react' });
  await reactBadge.getByRole('button', { name: '×' }).click();

  // 편집 input이 나타나지 않아야 함
  await expect(page.getByDisplayValue('react')).not.toBeVisible();
});
```

🟢 **Green 조건:** `handleDelete`에서 `e.stopPropagation()` + `onChange(tags.filter(...))`
🔵 **Refactor:** 삭제 후 포커스가 다음 배지 또는 `+` 버튼으로 이동하도록 개선 (접근성)

---

## 시나리오 SC-04: 중복 태그 입력 — 에러 Toast 및 필드 유지

**연결 PRD:** US-04
**연결 ADR:** ADR-001-E

### 테스트 코드

```ts
test('SC-04: 이미 존재하는 태그를 추가하면 에러 Toast가 표시되고 입력 필드가 유지된다', async ({ page }) => {
  // 🔴 Red: 중복 검사 없으면 같은 태그가 두 번 추가됨

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  // 이미 있는 'react' 태그를 다시 추가 시도
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('태그 입력').fill('react');
  await page.keyboard.press('Enter');

  // Toast 에러 메시지 확인
  await expect(page.getByText('이미 존재하는 태그입니다.')).toBeVisible();

  // 입력 필드가 닫히지 않고 유지됨
  await expect(page.getByPlaceholder('태그 입력')).toBeVisible();

  // Toast가 3000ms 후 사라짐
  await page.waitForTimeout(3500);
  await expect(page.getByText('이미 존재하는 태그입니다.')).not.toBeVisible();
});
```

```ts
test('SC-04-편집: 편집 중 다른 태그와 중복이면 에러 Toast가 표시된다', async ({ page }) => {
  // 🔴 Red: 편집 중 중복 검사(자기 자신 제외) 없음

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  // 'react' 태그를 'typescript'로 변경 시도 (typescript는 이미 존재)
  await page.getByText('react').click();
  const editInput = page.getByDisplayValue('react');
  await editInput.selectText();
  await editInput.fill('typescript');
  await page.keyboard.press('Enter');

  await expect(page.getByText('이미 존재하는 태그입니다.')).toBeVisible();
  // 원래 값 'react'가 유지됨
  await expect(page.getByText('react')).toBeVisible();
});
```

🟢 **Green 조건:** `tags.includes(value)` + `isDuplicate` 검사 + `toast.error()`
🔵 **Refactor:** Toast 지속 시간을 상수로 추출 (`ERROR_TOAST_DURATION = 3000`)

---

## 시나리오 SC-05: 취소 시 태그 변경 버려짐

**연결 PRD:** US-02
**연결 ADR:** ADR-001-C (비즉시 저장 — 취소 시 로컬 상태 버려짐)

### 테스트 코드

```ts
test('SC-05: 태그를 추가한 후 취소 버튼을 누르면 변경이 저장되지 않는다', async ({ page, request }) => {
  // 🔴 Red: 취소 시 로컬 상태 초기화 미구현이면 다음 진입 시 변경값 유지

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  // 태그 추가 후 취소
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('태그 입력').fill('취소될태그');
  await page.keyboard.press('Enter');

  // 편집기에서는 태그가 보임 (로컬 상태)
  await expect(page.getByText('취소될태그')).toBeVisible();

  // 취소 클릭
  await page.getByRole('button', { name: '취소' }).click();

  // 서버에는 저장되지 않았음을 확인
  const response = await request.get('http://localhost:3001/notes/e2e-note-2');
  const note = await response.json();
  expect(note.tags).not.toContain('취소될태그');
});
```

```ts
test('SC-05-재진입: 취소 후 같은 노트를 다시 선택하면 원래 태그로 복원된다', async ({ page }) => {
  // 🔴 Red: useEffect 동기화 없으면 로컬 상태 변경값이 남아있음

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  // 태그 추가 후 취소
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('태그 입력').fill('취소될태그');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: '취소' }).click();

  // 다른 노트 클릭 후 다시 돌아옴
  await page.getByText('E2E 테스트용 노트').click();
  await page.getByText('태그 있는 노트').click();

  // 취소됐던 태그가 없어야 함
  await expect(page.getByText('취소될태그')).not.toBeVisible();
  // 원래 태그는 그대로 있어야 함
  await expect(page.getByText('react')).toBeVisible();
  await expect(page.getByText('typescript')).toBeVisible();
});
```

🟢 **Green 조건:** `NoteEditor.useEffect`가 `selectedNoteId` 변경 시 `tags`를 `selectedNote.tags`로 초기화
🔵 **Refactor:** `onDone()` 호출 시 선택 상태 해제되므로 자연스럽게 초기화됨 — 별도 처리 불필요

---

## 시나리오 SC-06: 노트 목록 카드에서 태그 확인

**연결 PRD:** US-05

### 테스트 코드

```ts
test('SC-06: 태그가 있는 노트는 목록 카드에 태그 배지가 표시된다', async ({ page }) => {
  // 🔴 Red: NoteItem에 tags 렌더링 없으면 배지 못 찾음

  await page.goto('http://localhost:5173');

  const noteCard = page.locator('[data-testid="note-card"]').filter({ hasText: '태그 있는 노트' });
  await expect(noteCard.getByText('react')).toBeVisible();
  await expect(noteCard.getByText('typescript')).toBeVisible();
});
```

```ts
test('SC-06-빈태그: 태그가 없는 노트는 배지 영역이 렌더링되지 않는다', async ({ page }) => {
  // 🔴 Red: 조건부 렌더링 없으면 빈 div가 렌더링됨

  await page.goto('http://localhost:5173');

  const noteCard = page.locator('[data-testid="note-card"]').filter({ hasText: 'E2E 테스트용 노트' });
  const tagContainer = noteCard.locator('[data-testid="tag-list"]');
  await expect(tagContainer).not.toBeVisible();
});
```

🟢 **Green 조건:** `NoteItem`에서 `note.tags && note.tags.length > 0` 조건부 렌더링
🔵 **Refactor:** `data-testid="tag-list"` 속성 추가로 선택자 안정성 확보

---

## 시나리오 SC-07: 태그 입력 중 다른 노트 선택 → 편집 상태 초기화

**연결 ADR:** ADR-001-B (컴포넌트 언마운트 시 로컬 상태 자동 초기화)

```ts
test('SC-07: 태그 입력 중 다른 노트를 선택하면 편집 상태가 초기화된다', async ({ page }) => {
  // 🔴 Red: TagInput 언마운트/재마운트가 일어나지 않으면 상태 유지
  // (NoteEditor가 selectedNoteId 변경 시 재마운트되는 구조에 의존)

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  // 태그 입력 시작 (확정 안 함)
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('태그 입력').fill('미완성태그');

  // 다른 노트 선택
  await page.getByText('E2E 테스트용 노트').click();

  // 다시 원래 노트로 돌아왔을 때
  await page.getByText('태그 있는 노트').click();

  // 미완성 태그 입력 필드가 없어야 함
  await expect(page.getByPlaceholder('태그 입력')).not.toBeVisible();
  // + 버튼이 다시 보여야 함
  await expect(page.getByRole('button', { name: '+' })).toBeVisible();
});
```

🟢 **Green 조건:** `NoteEditor.useEffect`의 `selectedNoteId` 의존성으로 태그 상태 초기화 → `TagInput`도 `tags` prop이 리셋되어 내부 상태 재초기화
🔵 **Refactor:** `TagInput`이 `useEffect(() => { setIsAdding(false); setEditingIndex(null); }, [tags])` 추가 고려

---

## 시나리오 SC-08: Escape로 태그 입력 취소

**연결 PRD:** US-01 수용 기준

```ts
test('SC-08: 태그 입력 중 Escape를 누르면 입력 필드가 닫힌다', async ({ page }) => {
  // 🔴 Red: Escape 핸들링 없으면 필드가 열린 채로 유지

  await page.goto('http://localhost:5173');
  await page.getByText('태그 있는 노트').click();

  await page.getByRole('button', { name: '+' }).click();
  await expect(page.getByPlaceholder('태그 입력')).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.getByPlaceholder('태그 입력')).not.toBeVisible();
  await expect(page.getByRole('button', { name: '+' })).toBeVisible();
});
```

🟢 **Green 조건:** `onKeyDown`에서 `key === 'Escape'` → `handleCancel()`
🔵 **Refactor:** 추가 처리 불필요

---

## 시나리오 실행 순서 및 독립성

| 시나리오 | 사전 조건 | 독립 실행 가능 |
|----------|----------|--------------|
| SC-01 | 빈 db | ✅ |
| SC-02 | 태그 있는 노트 존재 | ✅ (`beforeEach` fixture) |
| SC-03 | 태그 있는 노트 존재 | ✅ |
| SC-04 | 태그 있는 노트 존재 | ✅ |
| SC-05 | 태그 있는 노트 존재 | ✅ |
| SC-06 | 두 종류 노트 존재 | ✅ |
| SC-07 | 두 종류 노트 존재 | ✅ |
| SC-08 | 태그 있는 노트 존재 | ✅ |

> `test.beforeEach`에서 `db.json`을 항상 `cleanDb`로 리셋하여 각 테스트를 완전히 격리한다.

---

## Playwright 설치 및 설정

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: [
    {
      command: 'pnpm run server',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm run dev:vite', // JSON Server 없이 Vite만 실행하는 스크립트 필요
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

> `package.json`에 `"dev:vite": "vite"` 스크립트 추가 필요.

---

## 커버리지 요약

| 시나리오 ID | PRD 스토리 | ADR 결정 | 테스트 케이스 수 |
|------------|-----------|---------|----------------|
| SC-01 | US-01, US-05 | 001-C | 2 |
| SC-02 | US-02 | 001-C | 1 |
| SC-03 | US-03 | 001-B | 2 |
| SC-04 | US-04 | 001-E | 2 |
| SC-05 | US-02 | 001-C | 2 |
| SC-06 | US-05 | 001-D | 2 |
| SC-07 | — | 001-B | 1 |
| SC-08 | US-01 | 001-B | 1 |
| **합계** | | | **13** |
