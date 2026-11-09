---
name: design-system
description: 노트 앱의 디자인 시스템(docs/design-system/) 중 작업에 필요한 문서만 골라 읽고 스타일 작업을 안내한다. 사용자가 색, 배경, 폰트, 글자 크기, 간격, 여백, 그림자, 테두리, 버튼, 카드, 입력창, 태그 칩, 다이얼로그, 모달, 디자인 시스템, 스타일, 토큰을 언급하거나 UI 모양을 만들거나 바꾸려 하면 명시적으로 스킬 이름을 부르지 않아도 반드시 이 스킬을 사용한다.
---

# design-system

`docs/design-system/`은 파일이 나뉘어 있다. 전체를 읽지 말고, 작업 대상에 맞는 문서만 읽는다.

## 절차

1. **대상 판별**: 요청이 어떤 요소를 건드리는지 아래 표로 정한다. 여러 개면 모두 읽는다.
2. **문서 읽기**: 표의 문서만 읽는다. 항상 `rules/do-and-dont.md`는 CLAUDE.md에서 이미 로드되어 있으므로 다시 읽지 않는다.
3. **토큰 확인**: 색, 간격, 모서리 값이 필요하면 `foundations/tokens.json`을 본다. 문서에는 값이 없고 토큰 이름만 있다.
4. **적용**: 토큰 이름 기반 Tailwind 클래스(`bg-surface-container-low` 등)를 쓴다. hex를 직접 쓰지 않는다.
5. **현황 확인**: 수정하는 파일이 `migration.md`의 항목에 해당하면 해당 차이를 함께 해소할지 사용자에게 알린다.

## 작업 대상별 읽을 문서

모든 경로는 `docs/design-system/` 기준이다.

| 작업 대상                   | 문서                                               |
| --------------------------- | -------------------------------------------------- |
| 색, 배경, 텍스트 색, 액센트 | `foundations/colors.md`, `foundations/tokens.json` |
| 폰트, 글자 크기, 레이블     | `foundations/typography.md`                        |
| 여백, 간격, 리스트 간격     | `foundations/spacing.md`                           |
| 카드 띄우기, 그림자, 테두리 | `foundations/elevation.md`                         |
| 버튼                        | `components/button.md`                             |
| NoteItem, NoteList          | `components/card-list.md`                          |
| NoteEditor 폼, 입력창       | `components/input.md`                              |
| 태그 칩                     | `components/tag-chip.md`                           |
| Alert, Confirm 상태 색      | `components/alert-confirm.md`                      |
| 모달, 드롭다운              | `components/dialog.md`                             |
| 현행 코드와의 차이          | `migration.md`                                     |

## 주의

- 구분선(`border-b`, `border-r`, `border-t`, `divide-y`, `h-px`)을 쓰지 않는다. 배경색 차이와 간격으로 구분한다.
- 순수 검정, `gray-*`, 검정 기반 그림자를 쓰지 않는다.
- UI 문구는 한국어로 쓴다.
- 토큰 값을 바꾸면 `foundations/tokens.json`을 고치고, `src/index.css`의 `@theme`와 Figma 변수를 수동으로 맞춘다.
