---
name: tdd-signature
description: docs/features/{feature}/issue-{번호}.md의 `## 시그니처` 섹션을 읽고, 테스트 코드를 먼저 쓸 수 있도록 src에 "빈 시그니처"(본문이 throw new Error('not implemented') 뿐인 함수/훅/컴포넌트와 타입 선언)를 생성하는 TDD 준비 스킬. 이미 존재하는 시그니처는 건드리지 않고 스킵했다고 알린다. 테스트 파일(*.test.ts, *.test.tsx)은 절대 건드리지 않는다. 사용자가 "/tdd-signature 1", "빈 시그니처 만들어줘", "시그니처 스캐폴딩", "테스트 쓰기 전에 모듈 뼈대 만들어줘", "import할 파일부터 만들어줘", "not implemented 스텁 생성"을 언급하면 스킬 이름을 직접 부르지 않아도 반드시 이 스킬을 사용한다. test-scenarios로 시그니처를 확정한 뒤, tdd-red로 테스트를 쓰기 전에 실행하는 단계다.
---

# tdd-signature

확정된 시그니처를 **빈 껍데기**로 `src/`에 만든다. 테스트가 import할 파일과 이름, 타입이 존재해야 `tdd-red`에서 테스트를 쓸 수 있고, 그 테스트가 import 오류가 아니라 **단언 실패**로 실패한다 (모듈이 없어서 깨지는 것은 올바른 Red가 아니다).

본문은 `throw new Error('not implemented')` 한 줄뿐이다. 구현을 조금이라도 채우면 Red에서 "무엇이 아직 없는지"가 가려지고, Green 단계에서 테스트가 요구하는 만큼만 구현한다는 원칙이 깨진다.

## 입력

- `$ARGUMENTS`: 이슈 문서 번호 `{N}` (예: `/tdd-signature 1`). 문서는 `docs/features/tag/issue-{N}.md`다.
- 다른 기능은 기능 폴더명을 앞에 붙인다 (예: `/tdd-signature trash 1` → `docs/features/trash/issue-1.md`). 생략하면 `tag`다.
- 인자가 없거나, 파일이 없거나, `## 시그니처` 섹션이 없으면 시작하지 않는다. 존재하는 `docs/features/*/issue-*.md` 목록을 보여주고 묻고 멈춘다. 시그니처 문서가 없으면 `/test-scenarios`를 먼저 하도록 안내한다.

## 절대 하지 않는 것

- **테스트 파일(`*.test.ts`, `*.test.tsx`)을 만들거나 수정하지 않는다.** 읽을 필요도 없다. 테스트 작성은 `tdd-red`의 몫이다.
- 구현 로직을 쓰지 않는다. 함수 본문은 항상 `throw new Error('not implemented');`뿐이다. 반환값, 기본값, 임시 상태도 넣지 않는다.
- 이미 존재하는 심볼을 덮어쓰거나 본문을 바꾸지 않는다 (아래 "스킵 규칙").
- `vite.config.ts`, `package.json` 등 설정 파일을 바꾸지 않는다.
- 커밋/푸시는 사용자가 요청할 때만 한다.

## 절차

### 1. 시그니처 읽기

`docs/features/{feature}/issue-{N}.md`의 `## 시그니처` 섹션(`## 테스트 시나리오` 앞까지)을 읽는다. 각 `### {파일 경로}` 아래 코드 블록이 파일별 시그니처다. 헤딩의 `(신규)` / `(수정)` 표시는 힌트로만 쓰고, 실제 존재 여부는 코드베이스를 직접 확인해서 판단한다 (문서와 현실이 어긋나 있을 수 있다).

시그니처 문서의 표기는 선언용이다. 그대로 복사하지 않고 실제 코드로 바꾼다.

- `export declare function` → `export function` (비동기 반환 `Promise<...>`면 `async`)
- 주석(`// 신규` 등)은 의도 설명이면 남기고, 문서 편집용 표시는 뺀다.
- 컴포넌트 반환 타입은 React 19에 전역 `JSX`가 없으므로 `ReactElement`(`import type { ReactElement } from 'react'`)를 쓴다.

### 2. 존재 확인 → 생성 또는 스킵

시그니처에 나온 **심볼 하나하나**(함수, 훅, 컴포넌트, 인터페이스/타입)에 대해 대상 파일에서 이미 선언되어 있는지 `Grep`/`Read`로 확인한다 (`export function X`, `export async function X`, `export const X`, `export interface X`, `export type X`).

- **파일이 없다** → 파일을 만들고 모든 심볼을 빈 시그니처로 쓴다.
- **파일은 있고 심볼이 없다** → 기존 코드는 그대로 두고 그 심볼만 추가한다.
- **심볼이 이미 있다** → **스킵한다. 아무것도 쓰지 않는다.** 시그니처가 문서와 다르더라도 덮어쓰지 않는다. 기존 코드의 변경은 구현 작업(Green)이므로 이 스킬의 범위 밖이다. 다른 점은 보고에 적어 사용자가 판단하게 한다.
- **기존 인터페이스/타입에 새 멤버만 추가되는 경우** (예: `Note`에 `deletedAt?`, Context 타입에 `trashNote`, Props에 `onTrashed`) → 기존 멤버는 두고 새 멤버만 추가한다. 타입 선언은 런타임 동작이 없으므로 빈 시그니처로 안전하다. 단, 추가한 멤버 때문에 기존 코드가 타입 오류를 내면(예: Provider가 새 Context 멤버를 값으로 제공하지 않음) 그 멤버를 채우는 **throw 스텁 한 줄**만 최소로 추가한다 (`trashNote: async () => { throw new Error('not implemented'); }`). 이 범위를 넘는 기존 코드 수정이 필요하면 하지 말고 보고한다.

### 3. 빈 시그니처 작성 규칙

프로젝트 컨벤션(`CLAUDE.md`)을 따른다.

- 컴포넌트는 named export, 파일명과 export명 일치(`TrashList.tsx` → `export function TrashList`), Props 인터페이스는 컴포넌트 바로 위에 `XxxProps`로 정의하고 파라미터에서 구조 분해한다.
- 훅은 `hooks/useXxx.ts`에 `export function useXxx`, 순수 함수는 `utils/*.ts`, 타입은 `types/*.ts`.
- 포맷은 Prettier 규칙(세미콜론, 작은따옴표, 2칸, trailing comma, printWidth 100).
- import는 시그니처에 쓰인 타입(`Note` 등)만 한다. 쓰지 않는 import는 넣지 않는다.
- 함수 본문은 `throw new Error('not implemented');` **정확히 이 문자열**이다 (대소문자·구두점까지). 테스트가 이 메시지에 기대는 일은 없어야 하지만, 문자열을 통일해 두면 Green 단계에서 남은 스텁을 `grep 'not implemented'`로 한 번에 찾을 수 있다.
- 본문이 throw뿐이라 파라미터가 전부 미사용이 되는데, 이 프로젝트의 `tsc`(`noUnusedParameters`)는 미사용 파라미터를 오류로 본다. 이 오류는 `eslint-disable`로 막을 수 없고 `_` 접두어만 통과한다. 그래서 **파라미터 이름 앞에 `_`를 붙인다** (`_input`, `_existing`). 컴포넌트·훅의 props는 구조 분해하지 않고 `_props: XxxProps` 하나로 받는다 (구조 분해한 요소가 전부 미사용이면 `tsc`가 오류를 낸다). 타입과 순서는 시그니처와 같게 유지하고, ESLint용으로 선언 위에 `// eslint-disable-next-line @typescript-eslint/no-unused-vars` 한 줄을 둔다. Green에서 구현할 때 이름과 구조 분해를 컨벤션대로 되돌린다.

작성 예:

```ts
// src/utils/trash.ts
import type { Note } from '../types/note';

export interface PartitionedNotes {
  activeNotes: Note[];
  trashedNotes: Note[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function partitionNotes(_notes: Note[]): PartitionedNotes {
  throw new Error('not implemented');
}
```

```tsx
// src/components/TrashList.tsx
import type { ReactElement } from 'react';
import type { Note } from '../types/note';

interface TrashListProps {
  notes: Note[];
  onBack: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TrashList(_props: TrashListProps): ReactElement {
  throw new Error('not implemented');
}
```

### 4. 검증

생성/수정 후 `npx tsc --noEmit`로 타입 오류가 없는지 확인한다. 빈 시그니처가 기존 코드를 깨뜨리면 안 된다. 오류가 나면 이 스킬이 만든 부분만 고친다. 기존 코드 쪽을 고쳐야 하는 오류면 고치지 않고 보고한다. 테스트는 실행하지 않는다 (다음 단계 `tdd-red`의 몫이다).

마지막으로 `git status`로 변경된 파일 목록에 `*.test.*`가 없는지 확인한다.

### 5. 보고

반드시 아래를 구분해서 알린다. 특히 **스킵한 것을 빠뜨리지 않는다.**

- **생성**: 새로 만든 파일과 심볼
- **추가**: 기존 파일에 더한 심볼/멤버
- **스킵**: 이미 존재해서 건드리지 않은 심볼과 파일. 문서 시그니처와 다른 점이 있으면 어떻게 다른지 한 줄씩 적는다.
- **보류**: 기존 코드 수정이 필요해서 하지 않은 것
- `tsc` 결과, 테스트 파일을 건드리지 않았다는 확인
- 다음 단계 제안: `/tdd-red {N}` (같은 기능 폴더 인자 포함)
