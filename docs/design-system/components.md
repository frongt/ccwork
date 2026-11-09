# 컴포넌트

## Buttons

| 종류             | 스타일                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Primary          | `tertiary` → `tertiary_container` 그라데이션, 텍스트 `on_tertiary`(#faf8ff), 모서리 `md`(0.375rem) |
| Secondary        | 배경 `surface_container_high`(#e2e9ec), 텍스트 `on_surface`, 테두리 없음                           |
| Tertiary (Ghost) | 배경 없음, 텍스트 `tertiary`(#0053dc). hover 시 액센트색 2% 불투명도 배경                          |

```html
<!-- Primary -->
<button
  class="rounded-md bg-linear-to-br from-tertiary to-tertiary-container px-5 py-2 text-on-tertiary hover:opacity-75 cursor-pointer"
>
  저장
</button>

<!-- Secondary -->
<button class="rounded-md bg-surface-container-high px-5 py-2 text-on-surface cursor-pointer">
  취소
</button>

<!-- Ghost -->
<button class="rounded-md px-5 py-2 text-tertiary hover:bg-tertiary/2 cursor-pointer">
  더보기
</button>
```

## Cards & Lists

- **The Divider Prohibition**: 리스트 항목을 선으로 구분하지 않는다. **간격**으로 구분한다.
  항목 사이 표준 간격은 `spacing.4`(1.4rem).
- **Hover**: 배경을 `surface`에서 `surface_container_low`(#f1f4f6)로 바꾼다.
- **선택됨**: 사이드바의 선택 상태는 `surface_container_highest`(#dbe4e7).

```html
<ul class="flex flex-col gap-[1.4rem]">
  <li class="rounded-md p-4 hover:bg-surface-container-low">노트 A</li>
  <li class="rounded-md bg-surface-container-highest p-4">노트 B (선택됨)</li>
</ul>
```

## Input Fields

- **Minimalist Entry**: 배경 `surface_container_lowest`(#ffffff), 1px **Ghost Border**.
  포커스 때만 1px `tertiary`(#0053dc) 테두리로 전환한다.
- **Label**: 항상 `label-md`를 입력창 **위**에 두고, 간격은 `spacing.1`(0.35rem).

```html
<label class="mb-[0.35rem] block text-xs uppercase tracking-[0.05em]">제목</label>
<input
  class="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-tertiary outline-none"
/>
```

## Knowledge Token (커스텀 칩)

토픽 태그(예: #javascript, #design)에 사용한다.

- 배경 `surface_container_highest`(#dbe4e7), 텍스트 `on_surface_variant`(#586064).
- 모서리 `full`, 테두리 없음.

```html
<span class="rounded-full bg-surface-container-highest px-3 py-1 text-xs text-on-surface-variant">
  #javascript
</span>
```

## Floating 요소 (모달, 드롭다운)

[colors.md](./colors.md)의 Glass 규칙(`surface` 80% + blur 12px)과
[elevation-spacing.md](./elevation-spacing.md)의 Ambient Shadow를 함께 적용한다.
`Alert`/`Confirm` 같은 다이얼로그가 해당한다.
