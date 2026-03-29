# 검색 기능 이슈 목록

## Issue #1: 제목/본문으로 노트를 검색할 수 있다

**Labels**: `feat/search`, `vertical-slice`

### 설명

검색 필터 순수 함수를 구현하고, SearchBar 컴포넌트를 생성하여 사이드바에서 Enter로 노트를 검색하는 기능을 완성한다. NoteList에 검색 필터를 적용하여 매칭되는 노트만 표시한다.

### 작업 범위

- `src/utils/noteFilters.ts`에 `filterNotesBySearch` 함수 추가
- `src/components/SearchBar.tsx` 신규 생성
- `src/components/NoteList.tsx`에 `searchQuery` prop 추가, 검색 필터 적용
- `src/App.tsx`에 `searchQuery` state + `handleSearch` + SearchBar 배치

### 완료 조건 (Acceptance Criteria)

- [ ] 사이드바 상단에 검색 입력 필드가 표시된다
- [ ] Enter 키를 누르면 검색어로 노트를 필터링한다
- [ ] 제목 또는 본문에 검색어가 포함된 노트만 표시한다
- [ ] 검색은 대소문자를 구분하지 않는다
- [ ] 검색어 앞뒤 공백은 trim 처리한다
- [ ] 공백만 입력하면 전체 노트를 표시한다
- [ ] X 버튼 클릭 시 검색어가 초기화되고 전체 노트를 표시한다
- [ ] 빈 검색어로 Enter 시 전체 노트를 표시한다
- [ ] 검색어 최대 길이는 100자이다
- [ ] 매칭 결과가 없으면 "검색 결과가 없습니다" 메시지를 표시한다

### 의존성

없음

---

## Issue #2: 검색과 태그 필터를 동시에 사용할 수 있다

**Labels**: `feat/search`, `vertical-slice`

### 설명

검색어와 태그 필터를 AND 조건으로 동시 적용하여, 두 조건 모두 만족하는 노트만 표시한다.

### 작업 범위

- `src/components/NoteList.tsx`에서 태그 필터 + 검색 필터 순차 적용
- 필터 조합 동작 검증

### 완료 조건 (Acceptance Criteria)

- [ ] 검색어와 태그 필터를 동시 적용하면 두 조건 모두 만족하는 노트만 표시한다
- [ ] 검색어를 초기화하면 태그 필터만 적용된 결과를 표시한다
- [ ] 태그 필터를 해제하면 검색어만 적용된 결과를 표시한다
- [ ] 둘 다 해제하면 전체 노트를 표시한다

### 의존성

- Issue #1 (검색 기능이 존재해야 함)

---

## 의존성 그래프

```
Issue #1 (검색 기능) → Issue #2 (태그+검색 조합)
```
