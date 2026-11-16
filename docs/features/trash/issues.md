# 휴지통 기능 이슈 목록

> 기준 문서: [`prd.md`](./prd.md), [`spec-fixed.md`](./spec-fixed.md) (확정본). 수직 슬라이싱 원칙으로 분해했다. 각 이슈는 타입 → 규칙(`utils`) → 상태(Context/`hooks`) → 표현(컴포넌트) → 조립을 필요한 만큼만 관통해, 단독으로 동작하고 테스트하고 시연할 수 있다. 구조는 ADR-001(휴지통 아키텍처, B안)과 ADR-002(규칙 / 상태 / 표현 분리)를 따른다.

## 이슈 요약

| #   | 제목                                                       | 의존 |
| --- | ---------------------------------------------------------- | ---- |
| 0   | (선행) `Confirm` 디자인 시스템 마이그레이션 — 새 이슈 없음 | 없음 |
| 1   | 노트를 삭제하면 휴지통에서 확인할 수 있다                  | #0   |
| 2   | 휴지통 노트를 읽기 전용으로 미리 보고 새 노트를 작성한다   | #1   |
| 3   | 휴지통 노트를 복구한다                                     | #2   |
| 4   | 휴지통 노트를 영구 삭제한다                                | #2   |
| 5   | 휴지통을 비운다                                            | #1   |

**#0은 이슈로 등록하지 않는다.** `docs/design-system/migration.md`의 기존 미완료 항목("다이얼로그", "Alert/Confirm 상태 색")을 `ds-migrate`로 처리하는 선행 작업이며, 사용자에게 보이는 동작이 없는 레이어 작업이라 수직 슬라이스 이슈로 만들지 않는다.

#2 완료 후 #3, #4는 서로 독립적이다. #5는 #1 완료 후 다른 이슈와 독립적이라 병렬 진행이 가능하다. #3과 #4는 둘 다 `NotesContext`와 `TrashList`를 수정하므로 같은 브랜치에서 진행하면 순차로 하는 편이 안전하다.

## 공통 사항

- TDD로 진행한다. 규칙은 `utils` 단위 테스트, 상태는 `renderHook`, 표현 컴포넌트는 props 기반 테스트, 조립(`App`, `NoteList`)은 통합 테스트(`api` mock 또는 `NotesProvider`)로 검증한다.
- `deletedAt`이 없는 기존 노트는 일반 노트이며, `db.json`을 수정하지 않는다. 휴지통 노트는 `deletedAt != null`로 판정한다.
- `Confirm`은 현재 디자인 시스템 Don't(`blue-500` 등 Tailwind 기본색 + 흰 글자)에 해당한다. **이슈 1 착수 전에 선행 작업 #0(`ds-migrate`로 `Confirm`을 `docs/design-system/components/alert-confirm.md` 기준에 맞춤)을 끝낸다.** 새 UI 문구는 한국어, 입력/버튼에는 `aria-label`을 단다.
- 서버 반영은 응답 후 로컬 배열을 갱신하고 재조회하지 않는다(낙관적 업데이트 없음). 실패 시 `Error`를 throw하고 호출 컴포넌트가 `try/catch`에서 `alert`로 알린다.
- 휴지통 노트는 일반 목록, 검색, 태그 필터에서 제외한다. 이는 Context가 노출하는 `notes`(일반)와 `trashedNotes`로 보장한다.

---

## 이슈 1. 노트를 삭제하면 휴지통에서 확인할 수 있다

### 설명

노트를 삭제(`Confirm` 후 `deletedAt` 기록)하면 일반 목록에서 사라지고, 사이드바 좌측 하단의 휴지통 아이콘을 눌러 휴지통 목록에서 확인하는 핵심 경로를 end-to-end로 만든다. 이후 이슈의 기반이 되는 워킹 스켈레톤이다. 휴지통 뷰 없이는 삭제 결과를 사용자에게 보여줄 수 없으므로 삭제, 휴지통 진입, 목록 표시를 한 이슈로 묶는다.

### 관통 범위

- 타입: `src/types/note.ts`에 `deletedAt?: string | null` 추가
- 규칙: `src/utils/trash.ts` — `partitionNotes`(일반/휴지통 분리), `sortByDeletedAt`(최근 삭제 순)
- 상태: `NotesContext` — `notes`(일반)/`trashedNotes` 파생, `trashNote` 추가. `src/hooks/useConfirmAction.ts`로 `Confirm` 대기/확인/취소 상태 캡슐화
- 표현: `SidebarFooter`(휴지통 아이콘), `TrashList`(삭제일 표시 항목, 빈 상태)
- 조립: `App`에 `sidebarView` 상태, `NoteList`/`NoteItem`의 삭제를 `Confirm` → `trashNote`로 교체

### 완료조건 (Acceptance Criteria)

- [ ] Given 일반 노트가 있다, When 노트의 삭제 버튼을 누른다, Then `Confirm`이 나타나고 아직 노트는 사라지지 않는다.
- [ ] Given 삭제 `Confirm`이 떠 있다, When 취소(또는 닫기)를 누른다, Then 서버 호출 없이 `Confirm`이 닫히고 노트가 그대로 남는다.
- [ ] Given 삭제 `Confirm`이 떠 있다, When 확인을 누른다, Then `PATCH`로 `deletedAt`(현재 일시)이 기록되고 응답 후 일반 목록에서 노트가 사라진다.
- [ ] Given 선택(열람/편집) 중인 노트가 있다, When 그 노트를 삭제한다, Then 선택 상태가 해제된다.
- [ ] Given 노트가 삭제되었다, When 일반 목록·검색·태그 필터용 `notes`를 조회한다, Then 삭제된 노트는 포함되지 않는다.
- [ ] Given 사이드바에 일반 목록이 보인다, When 좌측 하단 휴지통 아이콘(`aria-label="휴지통"`)을 누른다, Then 사이드바가 휴지통 목록으로 전환되고 일반 목록으로 돌아가는 수단이 보인다.
- [ ] Given 휴지통 뷰가 열려 있다, When 목록을 본다, Then 삭제된 노트가 최근 삭제 순으로 표시되고 각 항목에는 수정일 대신 삭제일(`toLocaleDateString('ko-KR')`)이 보인다.
- [ ] Given 휴지통에 노트가 없다, When 휴지통 뷰를 연다, Then 빈 상태 한국어 문구가 표시된다.
- [ ] Given 삭제 요청이 서버 오류로 실패한다, When 확인을 누른다, Then `alert`로 실패를 알리고 노트는 일반 목록에 남는다.
- [ ] Given `deletedAt`이 없는 기존 노트가 있다, When 앱을 연다, Then 모두 일반 목록에 에러 없이 표시된다.

---

## 이슈 2. 휴지통 노트를 읽기 전용으로 미리 보고 새 노트를 작성한다

### 설명

휴지통 목록에서 노트를 선택하면 메인 영역에 제목과 내용을 읽기 전용으로 보여준다. 복구/영구 삭제 전에 어떤 노트인지 확인하는 단계이며, 이슈 3·4의 입력이 된다. 휴지통 뷰에서 뷰 상태가 섞이지 않도록, 헤더 '+ 새 노트'를 누르면 일반 목록으로 전환해 작성 모드로 여는 조립 규칙도 함께 다룬다(뷰 전환과 선택 해제를 한 곳에서 다루기 위해 묶음).

### 관통 범위

- 상태: `App`에 휴지통 선택 상태(`selectedTrashId`) 추가
- 표현: `NotePreview`(제목, 내용, 편집 불가), `TrashList` 항목의 선택 상태
- 조립: `App`이 휴지통 뷰일 때 `main`에 `NotePreview`를, 일반 뷰일 때 `NoteEditor`를 주입. `handleNewNote`가 `sidebarView`를 일반으로 되돌리고 휴지통 선택을 해제한 뒤 생성 모드를 켠다

### 완료조건 (Acceptance Criteria)

- [ ] Given 휴지통 뷰가 열려 있다, When 휴지통 항목을 누른다, Then 메인 영역에 해당 노트의 제목과 내용이 표시되고 그 항목이 선택 상태로 강조된다.
- [ ] Given 미리보기가 표시되어 있다, When 메인 영역을 본다, Then 입력창/저장 버튼 없이 읽기 전용이며 편집할 수 없다.
- [ ] Given 휴지통 노트가 선택되어 있지 않다, When 휴지통 뷰를 연다, Then 메인 영역은 비어 있거나 안내 문구를 보여준다.
- [ ] Given 휴지통 노트가 선택되어 있다, When 일반 목록으로 돌아간다, Then 메인 영역은 일반 `NoteEditor`로 돌아가고 휴지통 선택은 해제된다.
- [ ] Given 제목/내용이 비어 있는 휴지통 노트다, When 선택한다, Then `(제목 없음)`, `(내용 없음)` 표시가 기존 `NoteItem`과 같은 방식으로 보인다.
- [ ] Given 휴지통 뷰가 열려 있다, When 헤더의 '+ 새 노트'를 누른다, Then 사이드바가 일반 목록으로 전환되고 메인 영역에 빈 `NoteEditor`가 생성 모드로 열린다.
- [ ] Given 휴지통 노트를 미리보기 중이다, When '+ 새 노트'를 누른다, Then 휴지통 선택이 해제되고 미리보기가 사라진다.
- [ ] Given 휴지통 뷰에서 '+ 새 노트'로 새 노트를 저장했다, When 목록을 본다, Then 새 노트는 일반 목록에 나타나고 휴지통에는 나타나지 않는다.

---

## 이슈 3. 휴지통 노트를 복구한다

### 설명

휴지통 항목의 '복구'를 `Confirm`으로 확인한 뒤 `deletedAt`을 제거하고 `updatedAt`을 현재 일시로 갱신해 일반 목록으로 되돌린다. 복구 후에도 휴지통 뷰에 머무르고 미리보기만 비운다.

### 관통 범위

- 상태: `NotesContext`에 `restoreNote` 추가(`PATCH { deletedAt: null }`, `updatedAt` 자동 갱신), `useConfirmAction` 재사용
- 표현: `TrashList` 항목에 '복구' 버튼
- 조립: `App`에서 복구 후 휴지통 뷰 유지, 복구한 노트가 미리보기 중이면 선택 해제

### 완료조건 (Acceptance Criteria)

- [ ] Given 휴지통에 노트가 있다, When 항목의 '복구'를 누른다, Then `Confirm`이 나타나고 아직 복구되지 않는다.
- [ ] Given 복구 `Confirm`이 떠 있다, When 취소를 누른다, Then 서버 호출 없이 닫히고 노트는 휴지통에 남는다.
- [ ] Given 복구 `Confirm`이 떠 있다, When 확인을 누른다, Then `PATCH`로 `deletedAt`이 제거(`null`)되고 `updatedAt`이 현재 일시로 갱신된다.
- [ ] Given 복구가 성공했다, When 목록을 본다, Then 휴지통 목록에서 그 노트가 사라지고 일반 목록에 다시 나타난다.
- [ ] Given 복구한 노트를 미리보기 중이었다, When 복구가 끝난다, Then 사이드바는 휴지통 뷰에 머물고 미리보기는 비워진다.
- [ ] Given 복구한 노트다, When 일반 목록에서 날짜를 본다, Then 수정일이 복구 시각으로 표시된다.
- [ ] Given 복구 요청이 서버 오류로 실패한다, When 확인을 누른다, Then `alert`로 실패를 알리고 노트는 휴지통에 남는다.

---

## 이슈 4. 휴지통 노트를 영구 삭제한다

### 설명

휴지통 항목의 '영구 삭제'를 `Confirm`으로 확인한 뒤 서버에서 노트를 완전히 지운다. 기존 `deleteNote`(`DELETE`)를 영구 삭제 의미로 고정해 재사용한다.

### 관통 범위

- 상태: `NotesContext.deleteNote`를 영구 삭제로 사용(전체 배열에서 제거), `useConfirmAction` 재사용
- 표현: `TrashList` 항목에 '영구 삭제' 버튼
- 조립: 영구 삭제한 노트가 미리보기 중이면 선택 해제

### 완료조건 (Acceptance Criteria)

- [ ] Given 휴지통에 노트가 있다, When 항목의 '영구 삭제'를 누른다, Then 되돌릴 수 없다는 한국어 안내가 담긴 `Confirm`이 나타난다.
- [ ] Given 영구 삭제 `Confirm`이 떠 있다, When 취소를 누른다, Then 서버 호출 없이 닫히고 노트는 휴지통에 남는다.
- [ ] Given 영구 삭제 `Confirm`이 떠 있다, When 확인을 누른다, Then `DELETE /notes/:id`가 호출되고 응답 후 휴지통 목록에서 그 노트가 사라진다.
- [ ] Given 영구 삭제한 노트를 미리보기 중이었다, When 삭제가 끝난다, Then 미리보기가 비워진다.
- [ ] Given 영구 삭제가 끝났다, When 앱을 새로고침한다, Then 그 노트는 일반 목록에도 휴지통에도 나타나지 않는다.
- [ ] Given 영구 삭제 요청이 서버 오류로 실패한다, When 확인을 누른다, Then `alert`로 실패를 알리고 노트는 휴지통에 남는다.

---

## 이슈 5. 휴지통을 비운다

### 설명

휴지통 뷰의 '휴지통 비우기'로 휴지통의 모든 노트를 `Confirm` 확인 후 한 번에 영구 삭제한다.

### 관통 범위

- 상태: `NotesContext`에 `emptyTrash` 추가(휴지통 노트 각각 `DELETE`), `useConfirmAction` 재사용
- 표현: `TrashList`(또는 휴지통 뷰 헤더)에 '휴지통 비우기' 버튼
- 조립: 비우기 후 미리보기 선택 해제

### 완료조건 (Acceptance Criteria)

- [ ] Given 휴지통에 노트가 하나 이상 있다, When '휴지통 비우기'를 누른다, Then 영구 삭제 안내가 담긴 `Confirm`이 나타난다.
- [ ] Given 비우기 `Confirm`이 떠 있다, When 취소를 누른다, Then 서버 호출 없이 닫히고 휴지통은 그대로다.
- [ ] Given 비우기 `Confirm`이 떠 있다, When 확인을 누른다, Then 휴지통의 모든 노트에 `DELETE`가 호출되고 휴지통 목록이 빈 상태 문구로 바뀐다.
- [ ] Given 휴지통이 비어 있다, When 휴지통 뷰를 본다, Then '휴지통 비우기' 버튼이 비활성화되거나 보이지 않는다.
- [ ] Given 비우기를 해도 일반 노트가 있다, When 일반 목록으로 돌아간다, Then 일반 노트는 그대로 남아 있다.
- [ ] Given 비우기 중 일부 `DELETE`가 실패한다, When 처리가 끝난다, Then `alert`로 실패를 알리고 삭제에 성공한 노트만 목록에서 제거되며 실패한 노트는 휴지통에 남는다.
