# 버튼

| 종류             | 스타일                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Primary          | `tertiary` → `tertiary_container` 그라데이션, 텍스트 `on_tertiary`, 모서리 `md`(0.375rem) |
| Secondary        | 배경 `surface_container_high`, 텍스트 `on_surface`, 테두리 없음                           |
| Tertiary (Ghost) | 배경 없음, 텍스트 `tertiary`. hover 시 액센트색 2% 불투명도 배경                          |

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

## 관련 문서

- 색: [colors.md](../foundations/colors.md)
- 금지 규칙: [do-and-dont.md](../rules/do-and-dont.md)
