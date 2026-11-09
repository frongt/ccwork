# 다이얼로그 (Floating 요소)

대상 컴포넌트: 모달과 드롭다운 등 떠 있는 요소 전반.
`Alert`, `Confirm`의 상태별 색과 구조는 [alert-confirm.md](./alert-confirm.md)를 따른다.

[colors.md](../foundations/colors.md)의 Glass 규칙(`surface` 80% + blur 12px)과
[elevation.md](../foundations/elevation.md)의 Ambient Shadow를 함께 적용한다.

- 배경은 Glass, 텍스트는 `on_surface`.
- 순백 배경, `border-gray-*`, 검정 기반 그림자는 쓰지 않는다.
- 경계가 꼭 필요하면 Ghost Border(`outline_variant` 15%)만 쓴다.

```html
<div
  class="bg-surface/80 backdrop-blur-[12px] rounded-md p-6 shadow-[0_16px_32px_rgba(43,52,55,0.06)]"
>
  <p class="text-on-surface">정말 삭제할까요?</p>
</div>
```

## 관련 문서

- 버튼: [button.md](./button.md)
- 금지 규칙: [do-and-dont.md](../rules/do-and-dont.md)
