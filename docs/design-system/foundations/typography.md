# 타이포그래피: Editorial Authority

**Inter**만 사용하고, 크기와 굵기 조절로 권위 있는 위계를 만든다.
한글은 Inter에 글리프가 없으므로 **Pretendard Variable**로 폴백한다.

```css
--font-sans: 'Inter', 'Pretendard Variable', system-ui, sans-serif;
```

## 스케일

| 역할                | 토큰          | 크기    | 규칙                                                             |
| ------------------- | ------------- | ------- | ---------------------------------------------------------------- |
| Display (선언)      | `display-lg`  | 3.5rem  | 랜딩 순간에만 사용. `letter-spacing: -0.02em`로 타이트하게       |
| Headline (인사이트) | `headline-md` | 1.75rem | 노트 제목. `line-height: 1.4`로 넉넉하게 읽히도록                |
| Body (지식)         | `body-lg`     | 1rem    | 주력 본문. 장문은 `on_surface_variant`, 핵심 강조는 `on_surface` |
| Label (메타데이터)  | `label-md`    | 0.75rem | 항상 `uppercase`, `letter-spacing: +0.05em`                      |

레이블은 기능적 메타데이터(날짜, 섹션명 등)를 서사적 콘텐츠와 구분하는 역할이다.

## Tailwind 예시

```html
<h1 class="text-[3.5rem] tracking-[-0.02em]">Display</h1>
<h2 class="text-[1.75rem] leading-[1.4] text-on-surface">노트 제목</h2>
<p class="text-base text-on-surface-variant">본문 내용</p>
<span class="text-xs uppercase tracking-[0.05em]">Updated</span>
```

## 원칙

- 이 시스템은 **타이포 중심**이다. 아이콘 대신 글자의 크기, 굵기, 색으로 위계를 만든다.
- 텍스트에 순수 검정(#000000)을 쓰지 않는다. `on_surface`(#2b3437)를 쓴다.
- 영문 레이블의 `uppercase`는 한글에는 영향이 없으므로, 한글 레이블은 크기와 색으로 구분한다.
