---
paths:
  - 'src/**/*.tsx'
  - 'src/**/*.css'
---

# 디자인 시스템 (스타일 파일 수정 시)

UI 스타일을 만들거나 바꾸기 전에 필요한 문서만 읽는다. 전체를 읽을 필요는 없다.

| 작업 대상                   | 읽을 문서                                                 |
| --------------------------- | --------------------------------------------------------- |
| 색, 배경, 텍스트 색         | `docs/design-system/foundations/colors.md`, `tokens.json` |
| 폰트, 글자 크기             | `docs/design-system/foundations/typography.md`            |
| 여백, 간격                  | `docs/design-system/foundations/spacing.md`               |
| 카드 띄우기, 그림자, 테두리 | `docs/design-system/foundations/elevation.md`             |
| 버튼                        | `docs/design-system/components/button.md`                 |
| NoteItem, NoteList          | `docs/design-system/components/card-list.md`              |
| NoteEditor 폼               | `docs/design-system/components/input.md`                  |
| 태그 칩                     | `docs/design-system/components/tag-chip.md`               |
| Alert, Confirm 상태 색      | `docs/design-system/components/alert-confirm.md`          |
| 모달, 드롭다운              | `docs/design-system/components/dialog.md`                 |

- 색은 hex를 직접 쓰지 않고 토큰 이름(`bg-surface-container-low` 등)으로 쓴다.
- 구분은 선이 아니라 배경색 차이와 간격으로 한다.
- 수정 후 변경 내용이 `docs/design-system/rules/do-and-dont.md`를 어기지 않는지 확인한다.
- 마이그레이션 항목을 처리했으면 `docs/design-system/migration.md`의 체크박스를 갱신한다.
