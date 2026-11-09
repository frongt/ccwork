# Do / Don't

스타일 작업 시 이 목록을 체크리스트로 쓴다. 원문 규칙에 구현 예시를 덧붙였다.

## Do

- **DO** 여백을 구조적 요소로 쓴다. 망설여지면 마진을 늘린다.
- **DO** 사이드바의 "선택됨" 상태에 `surface_container_highest`를 쓴다.
- **DO** 액센트(`tertiary`)는 의도가 있는 액션에만 아껴 쓴다.
- **DO** 영역 구분은 배경색 차이(`surface` ↔ `surface_container_low`)로 한다.
- **DO** 리스트 항목은 `spacing.4`(1.4rem) 간격으로 분리한다.
- **DO** 카드는 `surface_container` 위에 `surface_container_lowest`를 올려 Tonal Layering으로 띄운다.
- **DO** 떠 있는 요소에는 Glass(`surface` 80% + `blur(12px)`)와 Ambient Shadow를 쓴다.
- **DO** Primary 버튼에는 `tertiary` → `tertiary_container` 그라데이션을 쓴다.
- **DO** 장문 본문은 `on_surface_variant`, 핵심 강조는 `on_surface`로 쓴다.
- **DO** 레이블은 `label-md` + `uppercase` + `+0.05em`로 쓴다.
- **DO** 접근성상 경계가 꼭 필요하면 Ghost Border(`outline_variant` 15%)를 쓴다.
- **DO** 새 UI 문구는 한국어로 쓴다 (프로젝트 규칙).
- **DO** 상태(info / success / warning / error)는 `status_*` 토큰으로 전달한다. 헤더는 연한 `status_*_container`, 확인 버튼은 강한 `status_*`를 쓴다.
- **DO** 상태를 색만으로 구분하지 않는다. 제목 텍스트와 `role`(`alert` / `alertdialog`)로도 의미를 전달한다.

## Don't

- **DON'T** 텍스트에 순수 검정(#000000)을 쓰지 않는다. `on_surface`를 쓴다.
- **DON'T** 기본 그림자(`shadow-md`, `rgba(0,0,0,.x)`)를 쓰지 않는다. "엔지니어링된" 느낌이 난다.
- **DON'T** 기능적 명확성이 없다면 아이콘이나 이모지를 쓰지 않는다. 이 시스템은 타이포 중심이다.
- **DON'T** 사이드바를 테두리로 구분하지 않는다. `surface_container_low` → `surface` 색 차이를 쓴다.
- **DON'T** 영역 구분에 1px solid 테두리를 쓰지 않는다 (No-Line 규칙).
- **DON'T** 리스트 항목 사이에 구분선(`border-b`, `divide-y`, `h-px`)을 쓰지 않는다.
- **DON'T** 액센트 색을 장식용으로 남발하지 않는다.
- **DON'T** 입력창 테두리를 항상 진하게 두지 않는다. 포커스 때만 `tertiary`로 바꾼다.
- **DON'T** 폰트를 Inter(+Pretendard 폴백) 밖에서 고르지 않는다 (예: `Boogaloo`).
- **DON'T** 상태 색(`status_*`)을 상태 전달이 아닌 장식이나 일반 강조에 쓰지 않는다.
- **DON'T** 상태 헤더를 `blue-500`, `green-500`, `amber-500`, `red-500` 같은 Tailwind 기본색과 흰 글자로 만들지 않는다. 대비가 부족하다.

## 코드 예시

### 구분선 대신 색 차이

```html
<!-- ❌ -->
<aside class="w-72 border-r border-border">...</aside>

<!-- ✅ -->
<aside class="w-72 bg-surface-container-low">...</aside>
```

### 리스트 구분

```html
<!-- ❌ -->
<ul class="divide-y divide-border">
  ...
</ul>

<!-- ✅ -->
<ul class="flex flex-col gap-[1.4rem]">
  ...
</ul>
```

### 카드 띄우기

```html
<!-- ❌ 테두리 + 검정 기반 그림자 -->
<div class="bg-white border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">...</div>

<!-- ✅ Tonal Layering -->
<div class="bg-surface-container-lowest">...</div>
```

### Primary 버튼

```html
<!-- ❌ -->
<button class="bg-foreground text-card rounded-xl">저장</button>

<!-- ✅ -->
<button class="rounded-md bg-linear-to-br from-tertiary to-tertiary-container text-on-tertiary">
  저장
</button>
```

### 텍스트 색

```html
<!-- ❌ -->
<p class="text-black">...</p>

<!-- ✅ -->
<p class="text-on-surface-variant">...</p>
```
