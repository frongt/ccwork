---
description: 프로젝트 아키텍처를 분석하여 Docusaurus 문서로 작성한다. 컴포넌트 트리, 상태 관리, 데이터 흐름을 Mermaid 다이어그램으로 시각화하고 docs-site/ Docusaurus 사이트에 반영한다.
allowed-tools: Bash(*) Read(*) Write(*) Edit(*) Glob(*) Grep(*)
---

## 목적

이 프로젝트의 아키텍처 문서화 워크플로우를 실행한다.

`docs-site/` 는 Docusaurus 3 (TypeScript, classic 프리셋) 기반 문서 사이트다.
문서는 `docs-site/docs/architecture/` 아래 MDX 파일로 관리된다.

---

## 사이트 구조

```
docs-site/
├── docs/
│   ├── index.md                    ← 랜딩 페이지 (slug: /)
│   └── architecture/
│       ├── component-tree.mdx      ← 컴포넌트 트리 + Props 명세
│       ├── state-management.mdx   ← 전역/로컬 상태 다이어그램
│       └── data-flow.mdx          ← 생성/수정/삭제 흐름 (Tabs)
├── docusaurus.config.ts
└── sidebars.ts
```

---

## 문서 업데이트 절차

### 1. 코드베이스 파악

다음 파일을 먼저 읽어 현재 구조를 파악한다:

- `src/components/` — 컴포넌트 목록 및 Props
- `src/context/` — 전역 상태 정의
- `src/api/` — API 함수 목록
- `src/types/` — 타입 정의

### 2. 변경 사항 반영

코드 변경이 있을 때 해당 MDX 파일을 수정한다:

| 변경 대상 | 수정 파일 |
|-----------|-----------|
| 새 컴포넌트 추가 / Props 변경 | `component-tree.mdx` |
| Context 상태 / 로컬 state 변경 | `state-management.mdx` |
| 사용자 플로우 변경 (생성/수정/삭제) | `data-flow.mdx` |
| 새 아키텍처 영역 추가 | 새 MDX 파일 생성 + `sidebars.ts` 항목 추가 |

### 3. Mermaid 다이어그램 작성 규칙

MDX 파일 안에서 다음 형식으로 작성한다:

````md
```mermaid
flowchart TD
  ...
```
````

**색상 컨벤션 (Catppuccin Mocha 팔레트)**

| 의미 | fill | stroke | color |
|------|------|--------|-------|
| Context / Provider | `#2a1a40` | `#cba6f7` | `#cba6f7` |
| 컴포넌트 (일반) | `#1a2a40` | `#89b4fa` | `#89b4fa` |
| 앱 루트 / 성공 노드 | `#1e3a2f` | `#a6e3a1` | `#a6e3a1` |
| 에러 노드 | `#3a1a1a` | `#f38ba8` | `#f38ba8` |
| 조건 분기 | `#2a2a20` | `#f9e2af` | `#f9e2af` |
| 진입점 / 기타 | `#181825` | `#45475a` | `#6c7086` |

### 4. 탭 다이어그램 (`data-flow.mdx`) 수정 방법

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="create" label="노트 생성" default>

```mermaid
flowchart TD
  ...
```

  </TabItem>
</Tabs>
```

> **주의**: `<TabItem>` 태그와 코드 펜스 사이에 반드시 빈 줄이 있어야 한다 (MDX v2 파서 요구사항).

### 5. Props 명세 테이블 작성 규칙

- GFM 테이블 사용 (rowspan 없음 — 컴포넌트명 각 행 반복)
- `string | null` 등 파이프 문자는 `\|`로 이스케이프

```md
| 컴포넌트 | Prop | 타입 | 출처 | 설명 |
|---------|------|------|------|------|
| Layout | `sidebar` | `ReactNode` | App ↓ | 좌측 패널 슬롯 |
| NoteList | `selectedNoteId` | `string \| null` | App ↓ | 선택된 노트 ID |
```

---

## 새 섹션 추가 절차

1. `docs-site/docs/architecture/` 에 새 `.mdx` 파일 생성
2. 파일 상단 frontmatter 작성:
   ```md
   ---
   id: <파일명>
   title: <한국어 제목>
   sidebar_label: <사이드바 표시명>
   ---
   ```
3. `docs-site/sidebars.ts` 의 `items` 배열에 `'architecture/<파일명>'` 추가

---

## 검증

수정 후 빌드로 오류를 확인한다:

```bash
cd docs-site && npm run build
```

빌드 성공 시 `npm run start` (포트 3000) 또는 루트에서 `npm run docs` 로 확인한다.

---

## 포트 정보

| 서비스 | 포트 | 명령 |
|--------|------|------|
| Vite 앱 | 5173 | `npm run dev` |
| JSON Server | 3001 | (dev와 동시 실행) |
| Docusaurus | 3000 | `npm run docs` |
