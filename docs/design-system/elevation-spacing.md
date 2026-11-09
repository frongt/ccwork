# 깊이(Elevation)와 간격(Spacing)

## The Layering Principle

일반 카드에는 그림자를 쓰지 않는다. `surface_container`(#eaeff1) 섹션 위에
`surface_container_lowest`(#ffffff) 카드를 올려 **Tonal Layering**으로 "부드러운 들림"을 만든다.
자연스러운 종이 겹침을 흉내 낸 방식이다.

```html
<section class="bg-surface-container p-8">
  <article class="bg-surface-container-lowest rounded-md p-6">노트</article>
</section>
```

## Ambient Shadows

"새 노트" 팝오버처럼 **떠 있는 효과가 꼭 필요한 곳**에만 쓴다.

| 속성   | 값                                                 |
| ------ | -------------------------------------------------- |
| Blur   | 24px ~ 40px                                        |
| 투명도 | `on_surface`(#2b3437)의 6%                         |
| 색     | 액센트 색을 살짝 섞어 팔레트와 어우러지게 틴트한다 |

```html
<div class="shadow-[0_16px_32px_rgba(43,52,55,0.06)]">...</div>
```

기본 그림자(`shadow-md` 등)는 "설계된" 느낌이 아니라 "엔지니어링된" 느낌이므로 쓰지 않는다.

## Ghost Border (대체 수단)

접근성 때문에 비슷한 배경 사이에서 컨테이너를 꼭 구분해야 할 때만 쓴다.

- 토큰: `outline_variant`(#abb3b7)의 **15% 투명도**, 두께 1px.
- 선이 아니라 "선의 암시"여야 한다.

```html
<div class="border border-outline-variant/15">...</div>
```

## 스페이싱 로직

엄격한 **1.4rem (`spacing.4`)** 리듬을 따른다. 기본 단위는 0.35rem이다.

| 토큰         | 값      | 용도                                     |
| ------------ | ------- | ---------------------------------------- |
| `spacing.1`  | 0.35rem | 입력창 레이블과 입력 사이 간격           |
| `spacing.2`  | 0.7rem  | 헤드라인과 본문 사이 (수직 리듬)         |
| `spacing.4`  | 1.4rem  | 리스트 항목 사이 표준 간격 (구분선 대신) |
| `spacing.10` | 3.5rem  | 큰 레이아웃 블록 사이 (Atmospheric 품질) |

의심스러우면 여백을 늘린다. 여백은 구조적 요소다.
