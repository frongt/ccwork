# 디자인 시스템: The Digital Atelier

Stitch가 제공한 노트 앱 디자인 시스템을 정리한 문서다.
**스타일(색, 타이포, 간격, 그림자, 컴포넌트 모양)을 만들거나 바꾸는 모든 작업은 이 문서를 먼저 참조한다.**

## Creative North Star: The Curated Archive

이 시스템은 흔한 "지식 베이스" 템플릿을 넘어, 고급 디지털 아틀리에의 철학을 따른다.
Notion의 실용성에서 출발하되 **Soft Minimalism**으로 나아간다. 모든 노트는 단순한 데이터가 아니라
개인 박물관의 소중한 표본으로 다룬다.

일반적인 SaaS 느낌은 두 가지로 벗어난다.

- **Intentional Asymmetry**: 의도적인 비대칭.
- **Tonal Depth**: 테두리 상자 대신 중립 톤의 레이어 위에 콘텐츠를 띄워, 타이포가 숨 쉬게 한다.

UI는 배움의 "조용한 순간"을 방해하지 않아야 한다.

## 문서 목차

| 문서                                           | 내용                                                 |
| ---------------------------------------------- | ---------------------------------------------------- |
| [colors.md](./colors.md)                       | No-Line 규칙, Surface 계층, Glass & Gradient, 액센트 |
| [typography.md](./typography.md)               | Inter(+Pretendard) 스케일과 위계                     |
| [elevation-spacing.md](./elevation-spacing.md) | 레이어링, 그림자, Ghost Border, 1.4rem 간격 리듬     |
| [components.md](./components.md)               | 버튼, 카드/리스트, 입력, Knowledge Token(태그 칩)    |
| [do-and-dont.md](./do-and-dont.md)             | **Do / Don't** 규칙과 Tailwind 예시                  |

## 사용 방법

1. 스타일 작업 전에 해당 문서와 [do-and-dont.md](./do-and-dont.md)를 확인한다.
2. 색은 hex를 직접 쓰지 않고 [colors.md](./colors.md)의 시맨틱 토큰으로 쓴다.
3. 구분은 선이 아니라 **배경색 차이와 간격**으로 한다.
4. 원문의 "TIL(Today I Learned) entry"는 이 앱에서 **노트**를 뜻한다.

## 현행 코드와의 차이 (마이그레이션 메모)

이 문서는 목표 상태이며, 현재 코드는 아래 항목이 다르다. 코드는 아직 수정하지 않았다.

| 항목          | 현행 코드                                                                       | 디자인 시스템                                 |
| ------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| 폰트          | `Pretendard Variable`, 제목용 `Boogaloo`                                        | Inter + Pretendard 폴백                       |
| 구분선        | `Layout` 헤더 `border-b`, 사이드바 `border-r`, `NoteEditor`의 `h-px`/`border-t` | 금지. 배경색 차이와 간격 사용                 |
| 카드 테두리   | `NoteItem`, `NoteEditor`의 `border border-border`                               | 테두리 없이 `surface_container_lowest`로 띄움 |
| 주요 버튼     | `bg-foreground text-card` (검정)                                                | `tertiary` → `tertiary_container` 그라데이션  |
| 모서리        | `rounded-3xl`, `rounded-2xl`, `rounded-xl`                                      | 버튼 `md`(0.375rem), 태그 칩 `full`           |
| 그림자        | `shadow-[0_2px_12px_rgba(0,0,0,0.07)]` 등 검정 기반                             | Ambient Shadow (`on_surface` 6%, 액센트 틴트) |
| 다이얼로그    | `Alert`/`Confirm`의 `border-gray-200`, `text-gray-800`, 순백 배경               | Glass 규칙, `on_surface` 텍스트, Ghost Border |
| 텍스트 색     | `text-foreground` 등 `hsl(220 35% 14%)`                                         | 본문 `on_surface_variant`, 강조 `on_surface`  |
| 아이콘/이모지 | `NoteEditor` 빈 화면의 📝                                                       | 기능적으로 꼭 필요할 때만 사용                |
