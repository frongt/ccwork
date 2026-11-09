# Alert / Confirm

대상 컴포넌트: `src/components/Alert.tsx`, `src/components/Confirm.tsx`.
공통 Floating 규칙(Glass, Ambient Shadow)은 [dialog.md](./dialog.md)를 따른다. 이 문서는 **상태(variant)별 색과 구조**를 정한다.

## 상태 (variant)

| 상태      | 의미                       | 쓰는 곳              |
| --------- | -------------------------- | -------------------- |
| `info`    | 중립 안내                  | Alert 기본값         |
| `success` | 작업 완료                  | 저장 성공 알림       |
| `warning` | 되돌리기 어려운 작업 확인  | Confirm 기본값       |
| `error`   | 실패, 삭제처럼 위험한 작업 | 삭제 확인, 오류 알림 |

## 상태별 색

색 값은 [tokens.json](../foundations/tokens.json)이 원본이고, 배경만 상태에 따라 달라진다.

| 상태      | 헤더 배경 (연한 색)        | 확인 버튼 배경 (강한 색)   |
| --------- | -------------------------- | -------------------------- |
| `info`    | `status_info_container`    | `status_info` (`tertiary`) |
| `success` | `status_success_container` | `status_success`           |
| `warning` | `status_warning_container` | `status_warning`           |
| `error`   | `status_error_container`   | `status_error`             |

| 요소                | 색                                                                              |
| ------------------- | ------------------------------------------------------------------------------- |
| 헤더 제목           | `on_surface` (모든 상태 공통)                                                   |
| 닫기(×) 버튼        | 배경 없음, hover 시 `on_surface` 6% 배경                                        |
| 본문 영역           | Glass(`surface` 80% + blur 12px), 글자 `on_surface`                             |
| 확인 버튼 (Confirm) | 상태의 강한 색 배경, 글자 `on_tertiary`, 모서리 `md`                            |
| 취소 버튼 (Confirm) | 상태와 무관하게 Secondary(`surface_container_high` + `on_surface`), 테두리 없음 |

## 구조 원칙

- **헤더는 연한 색**: 헤더 전체를 진한 색으로 채우지 않는다. 상태는 연한 배경색으로 구분한다.
- **확인 버튼만 강한 색**: 상태를 대표하는 강한 색은 Confirm의 확인 버튼에만 쓴다. Alert에는 강한 색이 없다.
- **취소는 항상 중립**: 취소 버튼에 상태 색을 쓰지 않는다. 상태 색 버튼은 화면에 하나만 있어야 한다.
- **primary 그라데이션 금지**: 확인 버튼은 상태를 전달하는 색이므로 `tertiary` 그라데이션을 쓰지 않는다. 단, `info`는 `tertiary` 단색을 쓴다.
- **구분선과 테두리 금지**: 헤더와 본문은 배경색 차이로 구분한다. 컨테이너 모서리는 `md`(0.375rem), 그림자는 Ambient Shadow.
- **아이콘/이모지 금지**: 상태는 색과 제목 텍스트로 전달한다.
- **접근성**: 색만으로 구분하지 않는다. Alert는 `role="alert"`, Confirm은 `role="alertdialog"` + `aria-label`을 유지한다. 닫기 버튼에는 `aria-label="닫기"`.
- **대비**: 강한 색 위 `on_tertiary`는 4.5 이상, 연한 색 위 `on_surface`는 9 이상을 유지한다.

## 코드 예시

```html
<!-- Confirm / error -->
<div
  role="alertdialog"
  aria-label="노트 삭제"
  class="w-full max-w-sm overflow-hidden rounded-md bg-surface/80 backdrop-blur-[12px] shadow-[0_16px_32px_rgba(43,52,55,0.06)]"
>
  <div
    class="flex items-center justify-between bg-status-error-container px-4 py-3 text-on-surface"
  >
    <h3 class="text-sm font-semibold">노트 삭제</h3>
    <button type="button" aria-label="닫기" class="cursor-pointer">×</button>
  </div>
  <div class="px-4 py-4 text-sm leading-relaxed text-on-surface">정말 삭제할까요?</div>
  <div class="flex justify-end gap-2 px-4 pb-4">
    <button
      class="rounded-md bg-surface-container-high px-3 py-1.5 text-sm text-on-surface cursor-pointer"
    >
      취소
    </button>
    <button
      class="rounded-md bg-status-error px-3 py-1.5 text-sm text-on-tertiary hover:opacity-75 cursor-pointer"
    >
      삭제
    </button>
  </div>
</div>
```

## 구현 원칙

- 상태별 스타일 맵(헤더 클래스, 확인 버튼 클래스)은 Alert와 Confirm에서 **한 곳에서만 정의**하고 공유한다. 현재 `HEADER_STYLES`가 두 파일에 중복되어 있다.
- Tailwind가 클래스를 감지할 수 있도록 상태 클래스는 전체 문자열로 작성한다 (`` `bg-status-${variant}` `` 같은 조합 금지).
- `variant`의 기본값은 Alert `info`, Confirm `warning`이다.

## 관련 문서

- 상태 토큰: [colors.md](../foundations/colors.md)
- Floating 공통 규칙: [dialog.md](./dialog.md)
- 버튼: [button.md](./button.md)
- 금지 규칙: [do-and-dont.md](../rules/do-and-dont.md)
