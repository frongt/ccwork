---
name: ds-migrate
description: docs/design-system/migration.md의 미완료 항목 하나를 골라 해당 컴포넌트를 새 디자인 시스템 기준으로 수정하고 체크박스를 갱신한다. 사용자가 "디자인 시스템 마이그레이션", "디자인 시스템 적용", "migration 항목 처리", "다음 마이그레이션", "ds-migrate"를 언급하면 반드시 이 스킬을 사용한다.
---

# ds-migrate

`docs/design-system/migration.md`의 미완료(`[ ]`) 항목을 **한 번에 하나씩** 처리한다.
한 번 실행에 파일 하나만 다루고, 여러 컴포넌트를 한꺼번에 바꾸지 않는다.

## 절차

1. **항목 선택**: `migration.md`를 읽고 `[ ]` 항목을 고른다. 사용자가 지정하지 않았다면 "처리 순서 제안"(Layout → NoteItem → NoteEditor → Alert/Confirm) 순으로 정한다.
2. **계획**: 어떤 파일의 어느 클래스를 어떻게 바꿀지 사용자에게 먼저 보여주고 확인받는다.
3. **문서 읽기**: `design-system` skill의 매핑표에 따라 해당 컴포넌트 문서와 `foundations/tokens.json`만 읽는다.
4. **테스트 먼저**: 해당 컴포넌트에 테스트가 없으면 현재 동작을 고정하는 테스트를 먼저 작성한다. `useNotes`/`api`는 mock 하거나 `NotesProvider`로 감싼다.
5. **수정**: 토큰 기반 클래스로 바꾼다. `src/index.css`의 `@theme`에 필요한 토큰이 없으면 `tokens.json`의 값을 복사해 추가한다. 로직은 건드리지 않는다.
6. **검증**: `npm test`, `npm run lint`, `npx tsc --noEmit`을 실행하고 결과를 그대로 보고한다. 가능하면 `ds-reviewer` subagent로 위반 여부를 점검한다.
7. **기록**: `migration.md`의 해당 항목을 `[x]`로 바꾼다.
8. **커밋**: 사용자가 요청한 경우에만 한다. 형식은 `style: 제목` 또는 `refactor: 제목`(제목 50자 이하, 본문 10자 이상).

## 주의

- `db.json`을 건드리지 않는다.
- 훅 오류가 나면 직접 우회하지 말고 파일과 오류 내용을 보고한다.
- 토큰 값은 `tokens.json`이 원본이다. 값을 바꿨다면 Figma 변수를 수동으로 맞춰야 한다고 알린다.
