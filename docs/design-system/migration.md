# 마이그레이션 현황

디자인 시스템은 목표 상태이며, 현재 코드는 아래 항목이 다르다. 코드는 아직 수정하지 않았다.
항목을 처리하면 상태 칸을 `[x]`로 바꾼다.

| 상태 | 항목                  | 현행 코드                                                                                                   | 디자인 시스템                                                                                            |
| ---- | --------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [ ]  | 폰트                  | `Pretendard Variable`, 제목용 `Boogaloo`                                                                    | Inter + Pretendard 폴백                                                                                  |
| [ ]  | 구분선                | `Layout` 헤더 `border-b`, 사이드바 `border-r`, `NoteEditor`의 `h-px`/`border-t`                             | 금지. 배경색 차이와 간격 사용                                                                            |
| [ ]  | 카드 테두리           | `NoteItem`, `NoteEditor`의 `border border-border`                                                           | 테두리 없이 `surface_container_lowest`로 띄움                                                            |
| [ ]  | 주요 버튼             | `bg-foreground text-card` (검정)                                                                            | `tertiary` → `tertiary_container` 그라데이션                                                             |
| [ ]  | 모서리                | `rounded-3xl`, `rounded-2xl`, `rounded-xl`                                                                  | 버튼 `md`(0.375rem), 태그 칩 `full`                                                                      |
| [ ]  | 그림자                | `shadow-[0_2px_12px_rgba(0,0,0,0.07)]` 등 검정 기반                                                         | Ambient Shadow (`on_surface` 6%, 액센트 틴트)                                                            |
| [ ]  | 다이얼로그            | `Alert`/`Confirm`의 `border-gray-200`, `text-gray-800`, 순백 배경                                           | Glass 규칙, `on_surface` 텍스트, Ghost Border                                                            |
| [ ]  | Alert/Confirm 상태 색 | `HEADER_STYLES`/`CONFIRM_STYLES`가 `bg-blue/green/amber/red-500` + 흰 글자 (대비 2.15~3.76), 두 파일에 중복 | 헤더 `status_*_container` + `on_surface`, 확인 버튼 `status_*` + `on_tertiary`, 상태 맵은 한 곳에서 공유 |
| [ ]  | 텍스트 색             | `text-foreground` 등 `hsl(220 35% 14%)`                                                                     | 본문 `on_surface_variant`, 강조 `on_surface`                                                             |
| [ ]  | 아이콘/이모지         | `NoteEditor` 빈 화면의 📝                                                                                   | 기능적으로 꼭 필요할 때만 사용                                                                           |
| [ ]  | `@theme` 토큰         | `src/index.css`의 기존 토큰(`--color-card` 등)                                                              | `foundations/tokens.json` 기준 토큰으로 대체                                                             |

## 처리 순서 제안

Layout → NoteItem → NoteEditor → Alert/Confirm. 파일 하나씩 처리하고 `npm test`, `npm run lint`, `npx tsc --noEmit`을 확인한다.
