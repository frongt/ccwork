---
name: mermaid-diagram
description: src/ 디렉토리를 분석해 컴포넌트 의존성과 상태 흐름을 Mermaid 다이어그램으로 시각화한 HTML(docs/architecture/index.html)을 생성하고 브라우저로 연다. 사용자가 "구조 시각화", "아키텍처 다이어그램", "의존성 그림/관계도", "컴포넌트 구조 그려줘", "상태 흐름 보여줘", "mermaid"를 언급하거나 코드 구조를 그림으로 보고 싶어 하면 명시적으로 스킬 이름을 부르지 않아도 반드시 이 스킬을 사용한다.
---

# mermaid-diagram

`src/`의 실제 코드를 읽고 Mermaid 다이어그램이 담긴 단일 HTML 파일을 만든 뒤 브라우저로 띄운다.

## 입력 / 출력
- 분석 대상: `src/` 디렉토리만 (README, db.json 등은 근거로 쓰지 않는다)
- 출력: `docs/architecture/index.html` (디렉토리가 없으면 생성, 있으면 덮어쓰기)
- 외부 의존: Mermaid를 CDN(`cdn.jsdelivr.net/npm/mermaid@11`)으로 로드 → 보는 시점에 인터넷 필요

## 절차
1. **분석**: `src/**/*.{ts,tsx}`를 전부 읽고 **현재 코드**에서 추출한다. 코드는 계속 바뀌므로 기존 HTML이나 기억을 재사용하지 않는다.
   - 상대 경로 `import` (타입 전용 import는 구분)
   - 상태 소유자(`useState`/`createContext`)와 상태 이름
   - props 인터페이스와 콜백 연결 (`onXxx` ← `handleXxx`)
   - 외부 I/O (`fetch` URL/메서드)
2. **작성**: "다이어그램 구성"대로 HTML 생성
3. **검증**: 모든 화살표가 실제 import/호출에 근거하는지 코드와 대조한다. 잘못된 관계가 한 줄이라도 있으면 다이어그램 전체의 신뢰가 깨지므로, 코드에 없는 관계는 넣지 않는다. 호출 주체(어느 컴포넌트가 호출하는지)도 정확히 적는다.
4. **열기**: 브라우저로 띄우고, 열림/렌더링을 확인하지 못했다면 그대로 보고한다.

## 다이어그램 구성 (1번이 가장 중요)
1. **모듈 의존성** (`flowchart TD`): `A --> B` = A가 B를 import
   - `subgraph`로 레이어 구분: 진입점 / UI / 상태 / 데이터 / 타입
   - 타입 전용 의존은 점선 `-.->`, 외부 서버는 실린더 `[( )]`
   - 상태 보유 노드는 `<br/>`로 상태 이름 병기, `classDef`로 레이어별 색상
2. **컴포넌트 트리 + props** (`flowchart TD`): 렌더링 계층, 슬롯 props는 간선 라벨
3. **상태 흐름** (`flowchart LR`): 상태 소유 위치별 `subgraph`, 읽기/쓰기 방향 모두 표시
4. **시퀀스** (`sequenceDiagram`): 핵심 동작(저장/삭제)의 호출 순서, 에러 처리 위치 반영
5. **의존성 요약 표**: 모듈 / import 대상 / 역할

해당 요소가 없으면(예: Context 없음) 생략하거나 실제 구조에 맞게 바꾼다.

## HTML 규칙
- `<html lang="ko">`, UTF-8, 한국어
- 섹션: `<section>` + `<h2>` + `<p class="desc">` + `<pre class="mermaid">`
- `</body>` 직전에 mermaid CDN 스크립트 + `mermaid.initialize({ startOnLoad: true, ... })`
- 라벨에 `()`·`/`·`'`·`|`가 있으면 `"..."`로 감싼다. 주석은 `%%`
- 스타일은 인라인 `<style>` 하나만 사용

## 브라우저 열기
- Windows: `Start-Process "<절대경로>\docs\architecture\index.html"`
- macOS: `open <file>` / Linux: `xdg-open <file>`

## 완료 보고에 포함할 것
- 생성한 파일 경로, 근거로 삼은 파일 범위
- CDN 사용으로 오프라인에서는 렌더링되지 않는다는 점
- 커밋은 요청이 있을 때만 한다
