# 깊이 (Elevation)

## The Layering Principle

일반 카드에는 그림자를 쓰지 않는다. `surface_container` 섹션 위에
`surface_container_lowest` 카드를 올려 **Tonal Layering**으로 "부드러운 들림"을 만든다.
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
| 투명도 | `on_surface`의 6%                                  |
| 색     | 액센트 색을 살짝 섞어 팔레트와 어우러지게 틴트한다 |

```html
<div class="shadow-[0_16px_32px_rgba(43,52,55,0.06)]">...</div>
```

기본 그림자(`shadow-md` 등)는 "설계된" 느낌이 아니라 "엔지니어링된" 느낌이므로 쓰지 않는다.

## Ghost Border (대체 수단)

접근성 때문에 비슷한 배경 사이에서 컨테이너를 꼭 구분해야 할 때만 쓴다.

- 토큰: `outline_variant`의 **15% 투명도**, 두께 1px.
- 선이 아니라 "선의 암시"여야 한다.

```html
<div class="border border-outline-variant/15">...</div>
```

## 관련 문서

- 간격: [spacing.md](./spacing.md)
- 색: [colors.md](./colors.md)
