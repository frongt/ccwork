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

### foundations (토큰)

| 문서                                                     | 내용                                                 |
| -------------------------------------------------------- | ---------------------------------------------------- |
| [foundations/colors.md](./foundations/colors.md)         | No-Line 규칙, Surface 계층, Glass & Gradient, 액센트 |
| [foundations/typography.md](./foundations/typography.md) | Inter(+Pretendard) 스케일과 위계                     |
| [foundations/spacing.md](./foundations/spacing.md)       | 1.4rem 간격 리듬                                     |
| [foundations/elevation.md](./foundations/elevation.md)   | Tonal Layering, Ambient Shadow, Ghost Border         |
| [foundations/tokens.json](./foundations/tokens.json)     | 토큰 이름과 값의 단일 원본                           |

### components (컴포넌트)

| 문서                                                 | 내용                                    |
| ---------------------------------------------------- | --------------------------------------- |
| [components/button.md](./components/button.md)       | Primary / Secondary / Ghost 버튼        |
| [components/card-list.md](./components/card-list.md) | 카드, 리스트, hover, 선택 상태          |
| [components/input.md](./components/input.md)         | 입력창, 라벨                            |
| [components/tag-chip.md](./components/tag-chip.md)   | Knowledge Token (태그 칩)               |
| [components/dialog.md](./components/dialog.md)       | 모달, 드롭다운 (Glass + Ambient Shadow) |

### 규칙, 현황, 관리 구조

| 문서                                                   | 내용                                        |
| ------------------------------------------------------ | ------------------------------------------- |
| [rules/do-and-dont.md](./rules/do-and-dont.md)         | **Do / Don't** 규칙과 Tailwind 예시         |
| [migration.md](./migration.md)                         | 현행 코드와의 차이, 마이그레이션 체크리스트 |
| [design-system-diagram.md](./design-system-diagram.md) | 파일 구조, skill, hook, 흐름도              |

## 사용 방법

1. 스타일 작업 전에 해당 문서와 [rules/do-and-dont.md](./rules/do-and-dont.md)를 확인한다.
2. 색은 hex를 직접 쓰지 않고 시맨틱 토큰으로 쓴다. 값은 [tokens.json](./foundations/tokens.json)이 원본이다.
3. 구분은 선이 아니라 **배경색 차이와 간격**으로 한다.
4. 원문의 "TIL(Today I Learned) entry"는 이 앱에서 **노트**를 뜻한다.
5. 현행 코드와의 차이는 [migration.md](./migration.md)를 본다.
