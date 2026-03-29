# 노트 검색 PRD

## 1. 개요

사이드바에서 노트를 제목/본문으로 검색하는 기능. 검색어 입력 후 Enter로 실행하며, 기존 태그 필터와 AND 조건으로 조합된다.

---

## 2. 핵심 동작

### 2.1 검색 입력
- 사이드바 상단(NoteList 위)에 검색 입력 필드 배치
- Enter 키로 검색 실행
- 빈 검색어 시 전체 노트 표시

### 2.2 검색 로직
- 검색 대상: 제목(title) + 본문(content)
- 대소문자 구분 없음 (case-insensitive)
- 부분 일치 (contains)
- 검색어는 trim 처리

### 2.3 태그 필터와의 조합
- 검색어와 태그 필터는 AND 조건으로 동시 적용
- 태그 필터만 → 태그 매칭 노트, 검색어만 → 텍스트 매칭 노트, 둘 다 → 교집합

### 2.4 검색 초기화
- X 버튼 또는 빈 문자열 Enter로 초기화
- 초기화 시 전체 노트 표시 (태그 필터는 유지)

---

## 3. 제약 사항

| 항목 | 규칙 |
|------|------|
| 검색 대상 | 제목 + 본문 (태그 제외) |
| 검색 방식 | Enter 키로 실행 |
| 대소문자 | 구분 없음 |
| 매칭 방식 | 부분 일치 (contains) |
| 태그 필터 조합 | AND 조건 |
| 검색어 최대 길이 | 100자 |

---

## 4. UX 결정 사항

| 항목 | 결정 |
|------|------|
| 검색 UI 위치 | 사이드바 상단, NoteList 위 |
| 검색 실행 방식 | Enter 키 |
| 검색 초기화 | X 버튼 또는 빈 Enter |
| 태그 필터 조합 | AND (동시 적용) |
| 결과 없음 표시 | "검색 결과가 없습니다" 텍스트 |
| 검색어 trim | 앞뒤 공백 자동 제거 |

---

## 5. Out of Scope

- 정규식 검색
- 퍼지/유사어 검색
- 검색어 하이라이트
- 검색 히스토리
- 태그 내용 검색 (태그 필터로 대체)
- 실시간 타이핑 필터링
- 검색어 자동완성

---

## 6. 아키텍처

### 6.1 설계 원칙

기존 2계층 패턴(App = UI 상태, Context = 도메인 데이터)을 유지한다. 검색은 UI 필터링이므로 App 레벨 상태로 관리한다.

### 6.2 컴포넌트 트리

```
App/AppContent (selectedNoteId, isCreating, selectedTags, searchQuery ← NEW)
└─ NotesProvider (기존 그대로)
   ├─ Layout (sidebar, main 슬롯)
   │  ├─ Sidebar (Fragment)
   │  │  ├─ SearchBar ← NEW (검색 입력 UI)
   │  │  ├─ NoteList (selectedTags + searchQuery로 필터링)
   │  │  └─ TagFilter (기존)
   │  └─ Main
   │     └─ NoteEditor (기존)
```

### 6.3 데이터 구조

기존 Note 타입 변경 없음.

### 6.4 API 레이어

변경 없음. 검색은 클라이언트 사이드 필터링.

### 6.5 상태 관리

**AppContent에 추가되는 상태:**

```
searchQuery: string          — 현재 검색어 (Enter 후 확정된 값)
handleSearch(query: string)  — 검색 실행 (trim 후 상태 업데이트)
```

### 6.6 신규 컴포넌트

#### SearchBar (`src/components/SearchBar.tsx`)

사이드바 상단에 배치되는 검색 입력 컴포넌트.

- **Props**: `onSearch: (query: string) => void`
- **기능**:
  - 텍스트 입력 필드 + Enter로 검색 실행
  - X 버튼으로 검색어 초기화
  - maxLength 100
  - 내부에 입력 중인 값을 로컬 state로 관리, Enter 시 onSearch 콜백

#### 검색 필터 순수 함수

```ts
// src/utils/noteFilters.ts에 추가
filterNotesBySearch(notes: Note[], query: string): Note[]
```
- query가 빈 문자열이면 전체 반환
- title 또는 content에 query가 포함되면 매칭 (case-insensitive)

### 6.7 기존 컴포넌트 변경

| 컴포넌트 | 변경 내용 |
|----------|-----------|
| **AppContent** | `searchQuery` state + `handleSearch` 핸들러 추가, SearchBar에 전달 |
| **NoteList** | `searchQuery` prop 추가, filterNotesBySearch 적용 (태그 필터 후 추가 필터) |

### 6.8 아키텍처 선택 근거

| 기준 | 안 A: App state | 안 B: Context 확장 |
|------|-----------------|-------------------|
| 기존 패턴 일관성 (40%) | 5 | 3 |
| 변경 범위 최소화 (30%) | 5 | 3 |
| 테스트 용이성 (20%) | 4 | 4 |
| 프로젝트 규모 적합성 (10%) | 5 | 3 |
| **총점** | **4.8** | **3.2** |

→ **안 A 선택**: 태그 필터(selectedTags)와 동일한 패턴으로 App state에서 관리. Context는 도메인 데이터만 유지하는 기존 원칙 준수.

---

## 7. 변경 파일 목록

| 파일 | 작업 |
|------|------|
| `src/components/SearchBar.tsx` | **신규** — 검색 입력 UI |
| `src/utils/noteFilters.ts` | `filterNotesBySearch` 함수 추가 |
| `src/components/NoteList.tsx` | `searchQuery` prop 추가, 검색 필터 적용 |
| `src/App.tsx` | `searchQuery` state + `handleSearch` + SearchBar 배치 |

---

## 8. 구현 순서

1. **필터 함수**: `filterNotesBySearch` 순수 함수 + 단위 테스트
2. **검색 UI**: SearchBar 컴포넌트 + Enter/X 동작 테스트
3. **통합**: App state + NoteList 필터링 + 태그 필터 AND 조합
