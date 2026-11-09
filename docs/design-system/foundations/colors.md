# 색상과 Surface 철학

색의 실제 값(hex)은 [tokens.json](./tokens.json)이 원본이다. 이 문서는 토큰의 이름과 용도만 설명한다.

## The "No-Line" Rule

고급스러운 에디토리얼 느낌을 위해 **영역 구분용 1px solid 테두리는 금지**한다.
경계는 오직 **배경색 차이**로 만든다.

> 예: 사이드바는 `surface_container_low`, 옆의 본문은 `surface`.
> 경계는 "보이는" 것이 아니라 "느껴지는" 것이어야 한다.

## Surface 계층 (Nesting)

UI를 겹겹이 쌓인 물리적 재질로 본다. `surface-container` 단계를 중첩해 깊이를 만든다.

| 토큰                        | 용도                                                          |
| --------------------------- | ------------------------------------------------------------- |
| `background` / `surface`    | 기본 캔버스                                                   |
| `surface_container_low`     | 사이드바, 내비게이션 배경, 목록 hover                         |
| `surface_container`         | 카드가 올라가는 섹션 바탕                                     |
| `surface_container_lowest`  | 가장 우선순위 높은 카드, 활성 작업 영역, 입력창 ("들린 종이") |
| `surface_container_high`    | Secondary 버튼 배경                                           |
| `surface_container_highest` | 사이드바 "선택됨" 상태, Knowledge Token 배경                  |

## 텍스트와 선 색상

| 토큰                 | 용도                                   |
| -------------------- | -------------------------------------- |
| `on_surface`         | 기본 텍스트, 핵심 강조. 순수 검정 금지 |
| `on_surface_variant` | 장문 본문 (눈의 피로 감소)             |
| `outline_variant`    | Ghost Border (15% 투명도)              |

## 액센트 (Tertiary)

| 토큰                 | 용도                                               |
| -------------------- | -------------------------------------------------- |
| `tertiary`           | 의도가 담긴 액션, 포커스 테두리, Ghost 버튼 텍스트 |
| `tertiary_container` | Primary 그라데이션 끝색                            |
| `on_tertiary`        | Primary 버튼 텍스트                                |

액센트는 **단 하나**이며 아껴서 쓴다. 의도가 있는 액션에만 사용한다.

## 상태 색 (Status)

Alert, Confirm처럼 **상태를 전달하는 UI**에만 쓰는 색이다. 액센트와 달리 상태마다 한 쌍(강한 색 + 연한 색)을 둔다.
쓰는 방법은 [alert-confirm.md](../components/alert-confirm.md)를 본다.

| 토큰                                                                                                      | 용도                                         |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `status_info`                                                                                             | info 확인 버튼 배경. `tertiary`를 재사용한다 |
| `status_success`, `status_warning`, `status_error`                                                        | 확인 버튼 배경. 글자는 `on_tertiary`         |
| `status_info_container`, `status_success_container`, `status_warning_container`, `status_error_container` | 헤더 배경. 글자는 `on_surface`               |

- 강한 색 위 글자(`on_tertiary`)는 대비 4.5 이상, 연한 색 위 글자(`on_surface`)는 대비 9 이상이다. 값을 바꿀 때도 이 기준을 지킨다.
- 상태 색을 장식이나 일반 강조에 쓰지 않는다. 의미가 없는 곳에서는 액센트나 중립 토큰을 쓴다.
- 기존 `destructive`는 `status_error`로 대체한다.

## The "Glass & Gradient" Rule

- **Glassmorphism**: 떠 있는 요소(모달, 드롭다운, 떠 있는 breadcrumb)에 쓴다.
  `surface` 80% 불투명도 + `backdrop-filter: blur(12px)`.
- **Signature Texture**: Primary CTA는 `tertiary` → `tertiary_container`
  선형 그라데이션으로 단색 액센트에 "보석 같은" 깊이를 준다.

```html
<!-- Glass -->
<div class="bg-surface/80 backdrop-blur-[12px]">...</div>

<!-- Primary 그라데이션 -->
<button class="bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary">저장</button>
```

## Tailwind v4 `@theme` 매핑 제안 (아직 미적용)

`src/index.css`의 `@theme`에 옮길 때의 이름 제안이다. 적용 시 기존 토큰(`--color-card` 등)은 아래로 대체한다.
값은 [tokens.json](./tokens.json)의 `value`를 복사하고, 변경하면 `index.css`와 Figma 변수를 수동으로 맞춘다.

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
| `status_info`               | `status-info`               | `bg-status-info`               |
| `status_success`            | `status-success`            | `bg-status-success`            |
| `status_warning`            | `status-warning`            | `bg-status-warning`            |
| `status_error`              | `status-error`              | `bg-status-error`              |
| `status_*_container`        | `status-*-container`        | `bg-status-error-container`    |

기존 `--color-destructive`(삭제/오류)는 `status-error`로 대체한다.

## 관련 문서

- 깊이와 그림자: [elevation.md](./elevation.md)
- 버튼: [button.md](../components/button.md)
