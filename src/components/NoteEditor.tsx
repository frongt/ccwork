import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNotes } from '../context/NotesContext';
import { TagInput } from './TagInput';
import { MobileLayout } from './shared/MobileLayout';
import { TopAppBar } from './shared/TopAppBar';
import { RichEditor } from './shared/RichEditor';

interface NoteEditorProps {
  selectedNoteId: string | null;
  isCreating: boolean;
  onDone: () => void;
  isReadOnly?: boolean;
}

function ChevronLeftIcon() {
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="8 1 1 8 8 15" />
    </svg>
  );
}

/**
 * Mobile editor UI for creating a new note or editing a selected note.
 *
 * Synchronizes its form fields with the selected note when provided, validates the title,
 * persists changes through the notes context (adding or editing), shows success/error toasts,
 * and invokes `onDone` after saving or when the user navigates back.
 *
 * @param selectedNoteId - ID of the note to edit, or `null` when creating a new note
 * @param isCreating - Whether the editor is in "create" mode
 * @param onDone - Callback invoked after a successful save or when the user exits the editor
 * @returns The NoteEditor React element
 */
export function NoteEditor({ selectedNoteId, isCreating, onDone, isReadOnly = false }: NoteEditorProps) {
  const { notes, addNote, editNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  // 선택된 노트가 바뀔 때 폼 동기화
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setTags(selectedNote.tags ?? []);
    } else if (isCreating) {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [selectedNoteId, isCreating]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        await addNote(title, content, tags);
        toast.success('노트가 추가되었습니다');
      } else if (selectedNoteId) {
        await editNote(selectedNoteId, { title, content, tags });
        toast.success('노트가 저장되었습니다');
      }
      onDone();
    } catch (e) {
      console.error(e);
      toast.error('저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileLayout
      header={
        <TopAppBar
          title={isCreating ? '새 노트' : isReadOnly ? '아카이브' : '노트 편집'}
          left={
            <button className="icon-btn" aria-label="뒤로 가기" onClick={onDone}>
              <ChevronLeftIcon />
            </button>
          }
          right={
            !isReadOnly && (
              <button
                className="icon-btn"
                aria-label="저장"
                onClick={handleSave}
                disabled={saving}
                style={{
                  fontFamily: 'inherit',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: saving ? 'var(--color-foreground-subtle)' : 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: saving ? 'default' : 'pointer',
                  padding: '6px 4px',
                }}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            )
          }
        />
      }
    >
      {/* 에디터 캔버스 */}
      <div
        className="editor-canvas"
        style={{ flex: 1, margin: '0 16px', display: 'flex', flexDirection: 'column', gap: 0 }}
      >
        {/* 제목 입력 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="editor-title-input"
          style={{ marginBottom: 12 }}
          disabled={isReadOnly}
        />

        {/* 구분선 */}
        <div
          style={{
            height: 1,
            background: 'rgba(197,197,212,0.2)',
            marginBottom: 16,
          }}
        />

        {/* 내용 입력 */}
        <RichEditor value={content} onChange={setContent} placeholder="내용을 입력하세요..." readOnly={isReadOnly} />

        {/* 태그 영역 */}
        {!isReadOnly && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
            <TagInput tags={tags} onChange={setTags} />
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
