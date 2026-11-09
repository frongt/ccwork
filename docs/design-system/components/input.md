# 입력창

대상 컴포넌트: `NoteEditor`의 제목/내용 폼.

- **Minimalist Entry**: 배경 `surface_container_lowest`(#ffffff), 1px **Ghost Border**.
  포커스 때만 1px `tertiary`(#0053dc) 테두리로 전환한다.
- **Label**: 항상 `label-md`를 입력창 **위**에 두고, 간격은 `spacing.1`(0.35rem).

```html
<label class="mb-[0.35rem] block text-xs uppercase tracking-[0.05em]">제목</label>
<input
  class="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-tertiary outline-none"
/>
```

## 관련 문서

- Ghost Border: [elevation.md](../foundations/elevation.md)
- 레이블 타이포: [typography.md](../foundations/typography.md)
- 금지 규칙: [do-and-dont.md](../rules/do-and-dont.md)
