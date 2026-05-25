# Lumina Notes — Design System

Figma 파일 기반 디자인 시스템 문서. 모든 값은 Figma 실측값 기준.

> Figma: `a9XjY7zW6ax6ifSKWqBG3x` / Page 1

---

## 컬러 팔레트

### Brand Indigo

| Token | Value | Figma 사용처 |
|-------|-------|-------------|
| `--color-primary` | `#24389c` | FAB, Save 버튼, 헤더 타이틀, 활성 탭 텍스트, 인디고 태그 텍스트 |
| `--color-primary-hover` | `#1e2f87` | 버튼 호버 |
| `--color-primary-active` | `#182470` | 버튼 클릭 |
| `--color-primary-foreground` | `#ffffff` | 버튼 위 텍스트 |
| `--color-primary-light` | `#cacfff` | 어두운 인디고 카드(Card 5) 위 텍스트 |
| `--color-accent` | `#3f51b5` | 활성 필터 칩 배경, 핀 카드(Card 5) 배경 |
| `--color-accent-subtle` | `rgba(63,81,181,0.1)` | 인디고 태그 배경, 활성 탭 배경, 태그 입력 배경 |

### Surface / Background

| Token | Value | 사용처 |
|-------|-------|--------|
| `--color-background` | `#faf9f6` | 에디터 화면 배경 (따뜻한 종이 느낌) |
| `--color-background-app` | `#f9f9fb` | 노트 목록 · 앱 셸 배경 (차가운 라이트 그레이) |
| `--color-surface` | `#ffffff` | 카드, 인풋, 서치바 배경 |
| `--color-surface-raised` | `#eeeef0` | 포맷팅 바 배경 |

### Foreground / Text

| Token | Value | 사용처 |
|-------|-------|--------|
| `--color-foreground` | `#1a1c1d` | 기본 텍스트, 노트 본문, 체크리스트 미완료 항목 |
| `--color-foreground-muted` | `#454652` | 노트 미리보기 본문, 아이콘 버튼 기본 색 |
| `--color-foreground-subtle` | `#757684` | 날짜/메타 정보, 미완료 체크박스 보더, 하단탭 비활성 |
| `--color-foreground-placeholder` | `rgba(117,118,132,0.6)` | 서치바 플레이스홀더 |

### Border

| Token | Value | 사용처 |
|-------|-------|--------|
| `--color-border` | `#c5c5d4` | 인풋 테두리, 필터칩 비활성, Add Tag 점선 |
| `--color-border-subtle` | `rgba(197,197,212,0.3)` | 카드 내부 구분선 |
| `--color-border-divider` | `rgba(197,197,212,0.2)` | 에디터 제목-본문 구분선 |
| `--color-border-focus` | `#24389c` | 인풋 포커스 테두리, 태그 입력 테두리 |

### 태그 색상 (Figma 실측)

| 변형 | 배경 | 텍스트 | 사용 예 |
|------|------|--------|--------|
| `tag-indigo` | `rgba(63,81,181,0.1)` | `#24389c` | #Work, #Journal |
| `tag-pink` | `#fad7ff` | `#583d5f` | #Personal, #Strategy |
| `tag-rose` | `#ffd6fe` | `#7b008f` | #Design, #Research, #Draft (에디터) |

### 상태 색상

| Token | Value |
|-------|-------|
| `--color-destructive` | `#d32f2f` |
| `--color-success` | `#2e7d32` |
| `--color-warning` | `#e65100` |

---

## 타이포그래피

폰트: **Inter** (Regular 400, Medium 500, SemiBold 600, Bold 700)

### Size Scale

| Token | Size | Line Height | 사용처 |
|-------|------|-------------|--------|
| `--text-xs` | 12px | 16px (1.33) | 날짜, 태그 배지, 상태 배지 |
| `--text-sm` | 14px | 20px (1.43) | 카드 제목, 필터칩, 태그(에디터), Cancel 버튼 |
| `--text-base` | 16px | 24px (1.5) | 노트 본문 미리보기, 서치바, 체크리스트 |
| `--text-lg` | 18px | 28px (1.556) | 에디터 본문 textarea |
| `--text-2xl` | 24px | 32px | 에디터 헤더 타이틀 ("Edit Note") |
| `--text-3xl` | 32px | — | 에디터 노트 제목 인풋 |

### Font Weights

| Token | Value | 사용처 |
|-------|-------|--------|
| `--font-weight-normal` | 400 | 앱 헤더 타이틀, 노트 본문 |
| `--font-weight-medium` | 500 | 카드 제목, 필터칩, 태그(에디터), 버튼 |
| `--font-weight-semibold` | 600 | 에디터 헤더, 인디고 태그, 날짜, 하단탭, 상태배지 |
| `--font-weight-bold` | 700 | 에디터 노트 제목 |

### Letter Spacing

| Token | Value | 사용처 |
|-------|-------|--------|
| `--tracking-tight` | `-0.64px` | 에디터 제목 인풋 (32px) |
| `--tracking-snug` | `-0.4px` | 앱 헤더 타이틀 (16px) |
| `--tracking-wide` | `0.14px` | 카드 제목, 필터칩, 버튼 (14px) |
| `--tracking-wider` | `0.6px` | SYNCED 상태 배지 (uppercase) |

---

## 스페이싱

8px 기반 시스템.

| Token | Value | 주요 사용처 |
|-------|-------|------------|
| `--spacing-1` | 4px | 태그 내부 gap, 체크박스-텍스트 |
| `--spacing-2` | 8px | 카드 gap, 체크리스트 gap |
| `--spacing-3` | 12px | 태그 좌우 패딩 |
| `--spacing-4` | 16px | 카드 패딩, 섹션 내 간격 |
| `--spacing-5` | 20px | 헤더 좌우 패딩, 필터칩 패딩 |
| `--spacing-6` | 24px | 에디터 캔버스 패딩, FAB 우측 여백 |

### 레이아웃 상수

| Token | Value | 설명 |
|-------|-------|------|
| `--header-height` | 64px | Top App Bar 높이 |
| `--bottom-nav-height` | 80px | 하단 내비게이션 바 높이 |
| `--fab-size` | 56px | FAB 직경 |
| `--search-height` | 48px | 서치바 높이 |

---

## Border Radius

| Token | Value | 사용처 |
|-------|-------|--------|
| `--radius-sm` | 4px | 체크박스 |
| `--radius-md` | 8px | 범용 |
| `--radius-lg` | 12px | 하단 내비 상단 모서리 |
| `--radius-xl` | 16px | **노트 카드**, 서치바 인풋, 에디터 캔버스 |
| `--radius-full` | 9999px | **FAB**, 태그 배지, 필터칩, 버튼 (기본), 하단탭 활성 배경 |

---

## 그림자 (Shadows)

인디고 색조 적용. Figma 실측값.

| Token | Value | 사용처 |
|-------|-------|--------|
| `--shadow-card` | `0 4px 10px rgba(63,81,181,0.05)` | 일반 노트 카드 |
| `--shadow-card-elevated` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | 핀 카드(Card 5), 호버 카드, 토스트 |
| `--shadow-nav` | `0 -4px 10px rgba(63,81,181,0.05)` | 하단 내비바 (위방향) |
| `--shadow-fab` | `0 0 0 4px #f9f9fb, 0 25px 50px -12px rgba(0,0,0,0.25)` | FAB (링 + 드롭섀도) |
| `--shadow-focus` | `0 0 0 3px rgba(36,56,156,0.25)` | 인풋 포커스 링, 선택된 카드 |

---

## 컴포넌트별 스펙

### Note Card (일반)
```
배경:       #ffffff
테두리:     transparent (1px)
반경:       16px
패딩:       17px
gap:        8px (항목 간)
섀도:       shadow-card
카드 제목:  14px / medium / tracking 0.14px / color #1a1c1d
본문 미리:  16px / regular / line-height 24px / color #454652 / 3줄 clamp
날짜:       12px / semibold / color #757684
구분선:     border-top rgba(197,197,212,0.3) / padding-top 16px
```

### Note Card (핀/액센트, Card 5 스타일)
```
배경:       #3f51b5
텍스트:     #cacfff
구분선:     rgba(255,255,255,0.2)
섀도:       shadow-card-elevated
```

### Top App Bar
```
높이:       64px
배경:       #f9f9fb
패딩:       0 20px
앱 타이틀:  16px / regular / tracking -0.4px / #24389c
에디터 타이틀: 24px / semibold / tracking -0.24px / #24389c
Cancel 텍스트: 14px / medium / #24389c
Save 버튼:  배경 #24389c, 텍스트 #fff, pill (radius-full), px 24px py 8px
```

### Editor Canvas
```
배경:       #ffffff
반경:       16px
섀도:       shadow-card
패딩:       24px
노트 제목 인풋: 32px / bold / tracking -0.64px / placeholder: #c5c5d4
구분선:     rgba(197,197,212,0.2) / 두께 1px
본문 textarea: 18px / regular / line-height 28px / placeholder rgba(197,197,212,0.6)
상태 배지:  12px / semibold / uppercase / letter-spacing 0.6px / color #c5c5d4
```

### Tag Management (에디터)
```
태그 배경:  #ffd6fe
태그 텍스트: #7b008f / 14px / medium
태그 반경:  9999px / px 12px py 6px
X 버튼:     10.5px × 10.5px
Add Tag 버튼: border 1px dashed #c5c5d4 / pill / 14px / #757684
10자 제한 힌트: 12px / semibold / #c5c5d4 (입력 중에만 표시)
```

### Formatting Bar
```
배경:       #eeeef0
반경:       9999px (pill)
패딩:       8px 28px
아이콘 gap: 23.6px
아이콘:     Bold / Italic / Image / Link / More
```

### Search Bar
```
높이:       48px
배경:       #ffffff
테두리:     1px solid #c5c5d4
반경:       16px
패딩:       14px 17px 14px 49px
검색 아이콘: 18×18px, left 19px
placeholder: 16px / rgba(117,118,132,0.6)
```

### Filter Chips (수평 스크롤)
```
비활성: 배경 #ffffff / 테두리 #c5c5d4 / 텍스트 #454652 / 14px medium
활성:   배경 #3f51b5 / 텍스트 #cacfff
반경:   9999px
패딩:   9px 20px
그림자: 0 1px 1px rgba(0,0,0,0.05)
```

### Bottom Navigation Bar
```
높이:       80px
배경:       #f9f9fb
반경:       12px 12px 0 0 (상단 모서리만)
섀도:       shadow-nav
탭 레이블:  12px / semibold
활성:       배경 rgba(63,81,181,0.1) / 텍스트 #24389c / pill 배경
비활성:     #454652
탭 3개: Notes / Archive / Settings
```

### FAB (Floating Action Button)
```
크기:   56px × 56px
배경:   #24389c
반경:   9999px
섀도:   shadow-fab
위치:   right 24px, bottom (80px + 16px) = 96px
아이콘: + (16.3×16.3px, white)
```

### Toast
```
배경:   #1a1c1d (dark)
텍스트: #ffffff / 16px / medium
반경:   12px
패딩:   16px 24px
섀도:   shadow-card-elevated
위치:   bottom (80px + 16px), 가운데 정렬
중복 태그 경고: "이미 존재하는 태그입니다."
아이콘: 20×20px
닫기:   "닫기" 텍스트 버튼
```

### Checklist Item
```
체크박스: 20×20px / 반경 4px / 테두리 2px #757684
완료 체크박스: 배경 #24389c / 테두리 #24389c
완료 텍스트: line-through / color #757684
미완료 텍스트: 16px / regular / #1a1c1d
```

---

## 화면 구성 (4개 + 인터랙션 1개)

| 프레임 | 목적 | node-id |
|--------|------|---------|
| Note Editor | 노트 편집 화면 | `2:2` |
| Note List (Main) | 목록 · 검색 · 필터 화면 | `2:60` |
| Redesigned Note Editor | 목록+에디터 결합 레이아웃 | `2:199` |
| Note Detail | 읽기 전용 상세 화면 | `2:262` |
| Tag Interaction & Feedback | 태그 인터랙션 · 토스트 상태 | `2:348` |

---

## 다크 모드 확장 가이드

```css
.dark {
  --color-background:     #1a1c1d;
  --color-background-app: #111214;
  --color-surface:        #24262a;
  --color-surface-raised: #2e3035;
  --color-foreground:     #f0f0f4;
  --color-foreground-muted: #9a9aaa;
  --color-border:         rgba(197,197,212,0.2);
}
```
