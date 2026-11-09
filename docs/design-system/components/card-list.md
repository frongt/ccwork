# 카드와 리스트

대상 컴포넌트: `NoteItem`, `NoteList`.

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

## 관련 문서

- 카드 띄우기(Tonal Layering): [elevation.md](../foundations/elevation.md)
- 간격: [spacing.md](../foundations/spacing.md)
- 금지 규칙: [do-and-dont.md](../rules/do-and-dont.md)
