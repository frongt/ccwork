---
name: mermaid-diagram
description: src/ 구조를 분석하여 docs/architecture.html mermaid 다이어그램을 현재 코드에 맞게 재생성합니다.
user_invocable: true
---

# Mermaid Architecture Diagram 업데이트

## 목적

`src/` 하위 파일들의 컴포넌트 트리, 데이터 흐름, 파일 의존관계를 분석하여 `docs/architecture.html`의 mermaid 다이어그램을 현재 구조에 맞게 재생성한다.

## 실행 절차

1. **소스 분석**: `src/` 하위 모든 `.ts`, `.tsx` 파일을 읽고 export/import 관계를 파악
2. **기존 다이어그램 확인**: `docs/architecture.html` 현재 내용을 읽음
3. **다이어그램 재생성**: 아래 3개 mermaid 다이어그램을 현재 구조에 맞게 업데이트

## 다이어그램 구성

### 1. 컴포넌트 트리 (`graph TD`)

- 진입점(main.tsx)부터 리프 컴포넌트까지의 계층 구조
- 각 노드에 컴포넌트명과 핵심 역할을 `<small>` 태그로 표시
- Context Provider는 파란색(`fill:#dbeafe,stroke:#3b82f6`)
- Layout 계열은 노란색(`fill:#fef3c7,stroke:#f59e0b`)
- 일반 컴포넌트는 초록색(`fill:#d1fae5,stroke:#10b981`)
- 진입점은 회색(`fill:#e8e8e8,stroke:#999`)

### 2. 데이터 흐름 (`sequenceDiagram`)

- 주요 사용자 시나리오별 데이터 흐름 (CRUD 등)
- participant: Component, Context, API 레이어, 백엔드
- `Note over` 블록으로 시나리오 구분

### 3. 파일 구조 & 역할 (`graph LR`)

- `src/` 하위 디렉토리를 subgraph로 묶음
- 파일 간 import 의존관계를 화살표로 표현
- 외부 의존(db.json 등)은 점선 화살표(`-.->`)

## HTML 템플릿

기존 `docs/architecture.html`의 HTML 구조(head, style, mermaid CDN)를 유지하되 `<pre class="mermaid">` 블록만 교체한다. 새로운 다이어그램 섹션이 필요하면 `<h2>` + `<pre class="mermaid">`로 추가한다.

## 완료 후

변경 사항을 사용자에게 요약하고, 브라우저에서 확인할 수 있도록 `open docs/architecture.html`을 제안한다.
