# 색상과 Surface 철학

## The "No-Line" Rule

고급스러운 에디토리얼 느낌을 위해 **영역 구분용 1px solid 테두리는 금지**한다.
경계는 오직 **배경색 차이**로 만든다.

> 예: 사이드바는 `surface_container_low`(#f1f4f6), 옆의 본문은 `background`(#f8f9fa).
> 경계는 "보이는" 것이 아니라 "느껴지는" 것이어야 한다.

## Surface 계층 (Nesting)

UI를 겹겹이 쌓인 물리적 재질로 본다. `surface-container` 단계를 중첩해 깊이를 만든다.

| 토큰                        | Hex     | 용도                                                          |
| --------------------------- | ------- | ------------------------------------------------------------- |
| `background` / `surface`    | #f8f9fa | 기본 캔버스                                                   |
| `surface_container_low`     | #f1f4f6 | 사이드바, 내비게이션 배경, 목록 hover                         |
| `surface_container`         | #eaeff1 | 카드가 올라가는 섹션 바탕                                     |
| `surface_container_lowest`  | #ffffff | 가장 우선순위 높은 카드, 활성 작업 영역, 입력창 ("들린 종이") |
| `surface_container_high`    | #e2e9ec | Secondary 버튼 배경                                           |
| `surface_container_highest` | #dbe4e7 | 사이드바 "선택됨" 상태, Knowledge Token 배경                  |

## 텍스트와 선 색상

| 토큰                 | Hex     | 용도                                   |
| -------------------- | ------- | -------------------------------------- |
| `on_surface`         | #2b3437 | 기본 텍스트, 핵심 강조. 순수 검정 금지 |
| `on_surface_variant` | #586064 | 장문 본문 (눈의 피로 감소)             |
| `outline_variant`    | #abb3b7 | Ghost Border (15% 투명도)              |

## 액센트 (Tertiary)

| 토큰                 | Hex     | 용도                                               |
| -------------------- | ------- | -------------------------------------------------- |
| `tertiary`           | #0053dc | 의도가 담긴 액션, 포커스 테두리, Ghost 버튼 텍스트 |
| `tertiary_container` | #3e76fe | Primary 그라데이션 끝색                            |
| `on_tertiary`        | #faf8ff | Primary 버튼 텍스트                                |

액센트는 **단 하나**이며 아껴서 쓴다. 의도가 있는 액션에만 사용한다.

## The "Glass & Gradient" Rule

- **Glassmorphism**: 떠 있는 요소(모달, 드롭다운, 떠 있는 breadcrumb)에 쓴다.
  `surface`(#f8f9fa) 80% 불투명도 + `backdrop-filter: blur(12px)`.
- **Signature Texture**: Primary CTA는 `tertiary`(#0053dc) → `tertiary_container`(#3e76fe)
  선형 그라데이션으로 단색 액센트에 "보석 같은" 깊이를 준다.

```html
<!-- Glass -->
<div class="bg-[#f8f9fa]/80 backdrop-blur-[12px]">...</div>

<!-- Primary 그라데이션 -->
<button class="bg-linear-to-br from-[#0053dc] to-[#3e76fe] text-[#faf8ff]">저장</button>
```

## Tailwind v4 `@theme` 매핑 제안 (아직 미적용)

`src/index.css`의 `@theme`에 옮길 때의 이름 제안이다. 적용 시 기존 토큰(`--color-card` 등)은 아래로 대체한다.

| Stitch 토큰                 | Tailwind 토큰 (`--color-*`) | 사용 클래스 예                 |
| --------------------------- | --------------------------- | ------------------------------ |
| `background` / `surface`    | `surface`                   | `bg-surface`                   |
| `surface_container_low`     | `surface-container-low`     | `bg-surface-container-low`     |
| `surface_container`         | `surface-container`         | `bg-surface-container`         |
| `surface_container_lowest`  | `surface-container-lowest`  | `bg-surface-container-lowest`  |
| `surface_container_high`    | `surface-container-high`    | `bg-surface-container-high`    |
| `surface_container_highest` | `surface-container-highest` | `bg-surface-container-highest` |
| `on_surface`                | `on-surface`                | `text-on-surface`              |
| `on_surface_variant`        | `on-surface-variant`        | `text-on-surface-variant`      |
| `outline_variant`           | `outline-variant`           | `border-outline-variant/15`    |
| `tertiary`                  | `tertiary`                  | `text-tertiary`                |
| `tertiary_container`        | `tertiary-container`        | `to-tertiary-container`        |
| `on_tertiary`               | `on-tertiary`               | `text-on-tertiary`             |

기존 `--color-destructive`(삭제/오류)는 원문에 정의가 없으므로 그대로 유지한다.
