# 입력창

대상 컴포넌트: `NoteEditor`의 제목/내용 폼.

- **Minimalist Entry**: 배경 `surface_container_lowest`, 1px **Ghost Border**.
  포커스 때만 1px `tertiary` 테두리로 전환한다.
- **Label**: 항상 `label-md`를 입력창 **위**에 두고, 간격은 `spacing.1`(0.35rem).
- **aria-label 필수**: 모든 입력 요소(`input`, `textarea`, `select`)에는 `aria-label`이 있어야 한다.
  `placeholder`는 레이블을 대신하지 못하고, 화면에 보이는 `label`이 있어도 `aria-label`을 함께 쓴다.
  값은 한국어로 입력의 목적을 짧게 쓴다 (예: "노트 제목", "노트 내용", "노트 검색").
  `type="hidden"`만 예외다.

```html
<label class="mb-[0.35rem] block text-xs uppercase tracking-[0.05em]">제목</label>
<input
  aria-label="노트 제목"
  class="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-tertiary outline-none"
/>
```

```html
<!-- ❌ placeholder만 있음 -->
<input placeholder="제목" />

<!-- ✅ -->
<input placeholder="제목" aria-label="노트 제목" />
```

## 관련 문서

- Ghost Border: [elevation.md](../foundations/elevation.md)
- 레이블 타이포: [typography.md](../foundations/typography.md)
- 금지 규칙: [do-and-dont.md](../rules/do-and-dont.md)
