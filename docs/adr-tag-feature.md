# ADR: 태그 기능 아키텍처 결정 기록

**문서 번호:** ADR-001
**작성일:** 2026-05-20
**상태:** 수락됨 (Accepted)
**결정자:** 개발팀
**관련 파일:** `src/components/TagInput.tsx`, `src/types/note.ts`, `src/context/NotesContext.tsx`, `src/api/notes.ts`

---

## 배경

노트 앱에 태그 기능을 추가하면서 다음 사항들에 대한 설계 결정이 필요했다.

1. 태그 데이터를 어떤 구조로 저장할 것인가
2. 태그 편집 상태를 어디서 관리할 것인가
3. 저장 시점을 언제로 할 것인가 (즉시 저장 vs 노트 저장 시 일괄)
4. 태그 컴포넌트의 역할 경계를 어떻게 나눌 것인가

---

## ADR-001-A: 태그 데이터 구조 — `string[]` 플랫 배열

### 결정

`Note` 인터페이스에 `tags: string[]`를 추가하고, 태그를 단순 문자열 배열로 저장한다.

```typescript
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];       // ← 결정된 구조
  createdAt: string;
  updatedAt: string;
}
```

### 고려한 대안

| 대안 | 설명 | 기각 이유 |
|------|------|----------|
| `{ id, name, color }[]` 객체 배열 | 색상, 메타데이터 포함 | 현 단계에서 과설계. 태그 공유/재사용 개념 없음 |
| 별도 `tags` 컬렉션 + 참조 ID | 관계형 정규화 | JSON Server 수준에서 불필요한 복잡도 |
| `string` 콤마 구분 단일 필드 | `"react,typescript"` | 파싱 오류 위험, 타입 불안전 |

### 결정 근거

- 현재 요구사항(표시·필터)에 문자열 값만으로 충분하다.
- JSON Server의 단순 PATCH로 배열 전체를 교체하는 방식이 가장 단순하다.
- 향후 색상 등 메타데이터가 필요해지면 `Tag` 객체 배열로 마이그레이션 가능하다.

### 결과

- `api/notes.ts`의 `createNote`, `updateNote` 함수가 `tags` 필드를 그대로 직렬화한다.
- JSON Server `db.json`에 `"tags": []` 형태로 저장된다.

---

## ADR-001-B: 태그 편집 상태 — `TagInput` 로컬 상태

### 결정

태그의 추가·편집·삭제 인터랙션 상태(`isAdding`, `editingIndex`, `inputValue`)를 `TagInput` 컴포넌트 내부 로컬 `useState`로 관리한다. 확정된 태그 배열(`string[]`)만 `onChange` 콜백으로 부모에 전파한다.

```typescript
// TagInput 내부
const [isAdding, setIsAdding] = useState(false);
const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [inputValue, setInputValue] = useState('');
```

### 고려한 대안

| 대안 | 기각 이유 |
|------|----------|
| `NoteEditor` 에서 전부 관리 | 편집기 컴포넌트가 태그 UX 세부사항을 알아야 함. 관심사 혼재 |
| `NotesContext` 전역 상태 | 임시 입력 상태가 전역에 노출됨. 다른 노트 선택 시 정리 필요 등 부작용 |
| `useReducer` 사용 | 상태 3개의 복잡도에서는 `useState` 3개가 더 명확함 |

### 결정 근거

- 태그 입력 중인 값(`inputValue`)은 노트 저장 전까지 임시 데이터이므로, 부모나 전역이 알 필요가 없다.
- `TagInput`은 `tags: string[]`를 받고 `onChange(newTags)`를 내보내는 **제어 컴포넌트**로 동작하므로, 내부 상태가 외부와 격리된다.
- 컴포넌트 언마운트 시 자동으로 상태가 초기화된다.

### 결과

- `TagInput`의 Props 인터페이스는 단 두 개다:
  ```typescript
  interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
  }
  ```
- `NoteEditor`는 `tags` 상태만 보유하고 TagInput의 UI 세부사항과 결합되지 않는다.

---

## ADR-001-C: 저장 시점 — 노트 저장 시 일괄 반영 (비즉시 저장)

### 결정

태그 추가·수정·삭제는 즉시 서버에 PATCH 요청을 보내지 않는다. `NoteEditor`의 `handleSave()` 호출 시에만 `tags` 배열이 노트 전체와 함께 저장된다.

### 고려한 대안

| 대안 | 설명 | 기각 이유 |
|------|------|----------|
| 태그 변경 즉시 PATCH | `onChange` 시마다 서버 요청 | 타이핑마다 요청 발생, 취소 불가, 네트워크 비용 |
| 디바운스 후 자동 저장 | 입력 후 N ms뒤 PATCH | 복잡도 증가, 저장 중 노트 이동 시 경쟁 상태 위험 |
| 낙관적 업데이트 | 즉시 UI 반영 + 백그라운드 PATCH | 현 단계 오버엔지니어링 |

### 결정 근거

- 노트 제목·내용과 태그가 동일한 저장 사이클을 공유하는 것이 사용자에게 예측 가능한 UX를 제공한다.
- "저장" 버튼이 있는 편집기 패러다임에서 부분 저장은 오히려 혼란을 유발한다.
- 학습용 프로젝트로서 단순성이 최우선이다.

### 결과

- 태그 변경 후 "취소" 클릭 시 변경이 버려진다 (의도된 동작).
- `NoteEditor.useEffect`로 `selectedNoteId` 변경 시 `tags`가 원본으로 초기화된다.

---

## ADR-001-D: 컴포넌트 역할 경계 — `TagInput` vs `Tag` (공용)

### 결정

인터랙션 로직(`TagInput`)과 표시 전용 배지(`Tag`)를 별도 컴포넌트로 분리한다.

| 컴포넌트 | 위치 | 역할 |
|----------|------|------|
| `TagInput` | `src/components/TagInput.tsx` | 추가·편집·삭제 인터랙션, `NoteEditor` 전용 |
| `Tag` | `src/components/shared/Tag.tsx` | 읽기 전용 배지 표시, `NoteItem` 등 재사용 |

### 결정 근거

- `NoteItem`(목록 카드)은 태그를 표시만 하면 된다. 편집 로직이 포함된 `TagInput`을 가져다 쓰는 것은 불필요한 코드 포함이다.
- 공용 `Tag` 컴포넌트는 6가지 색상 팔레트(`indigo/violet/teal/amber/rose/slate`)를 지원하여 디자인 시스템과 일치한다.
- `TagInput` 내부의 배지 스타일도 장기적으로는 공용 `Tag` 클래스로 마이그레이션되어야 한다 (현재는 인라인 Tailwind 사용 중).

### 현재 상태 vs 목표 상태

```
현재:
  NoteEditor → TagInput (편집 + 배지 표시 혼합)
  NoteItem   → 인라인 span (독자적 스타일)

목표:
  NoteEditor → TagInput (편집 로직)
                 └─ 내부 배지: shared/Tag 사용
  NoteItem   → shared/Tag (표시 전용)
```

---

## ADR-001-E: 중복 검사 피드백 — Toast 에러 (인라인 에러 메시지 미사용)

### 결정

중복 태그 입력 시 인라인 에러 메시지(배지 아래 빨간 텍스트) 대신 Toast 알림(`react-hot-toast`)을 사용한다.

### 결정 근거

- 태그 배지는 작은 인라인 UI 요소로, 에러 메시지를 배치할 레이아웃 공간이 없다.
- Toast는 이미 앱 전체에서 저장 성공/실패 알림에 사용하는 일관된 패턴이다.
- 입력 필드가 닫히지 않고 유지되므로, 사용자는 Toast를 읽고 즉시 수정할 수 있다.

### 결과

- `AppToaster`가 `error` duration을 3000ms로 설정하여 메시지 가독성을 확보한다.
- 중복 감지 시 `toast.error('이미 존재하는 태그입니다.')`를 호출하고 상태를 변경하지 않는다.

---

## 결정 요약표

| ID | 결정 사항 | 결정 |
|----|----------|------|
| A | 태그 데이터 구조 | `string[]` 플랫 배열 |
| B | 편집 상태 위치 | `TagInput` 내부 로컬 상태 |
| C | 저장 시점 | 노트 저장 시 일괄 반영 |
| D | 컴포넌트 분리 | `TagInput` (편집) / `Tag` (표시) 분리 |
| E | 중복 피드백 방식 | Toast 에러 알림 |

---

## 미결 사항 및 향후 검토

| 항목 | 내용 |
|------|------|
| 태그 색상 자동 지정 | 태그 문자열 해시 → `TagColor` 6종 중 하나 자동 매핑 고려 |
| 태그 길이 검증 | PRD에 10자 제한이 명시되어 있으나 `TagInput`에 미구현 |
| `TagInput` 내부 배지 마이그레이션 | 인라인 Tailwind → `shared/Tag` 컴포넌트 클래스 |
| 태그 필터링 연동 | `FilterChip` 컴포넌트와 `NoteList` 연동 설계 필요 |
