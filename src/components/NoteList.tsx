import toast from 'react-hot-toast';
import { useNotes } from '../context/NotesContext';
import { NoteItem } from './NoteItem';
import { EmptyState } from './shared/EmptyState';

interface NoteListProps {
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  searchQuery?: string;
  activeTag?: string;
}

export function NoteList({ selectedNoteId, onSelect, searchQuery = '', activeTag = 'All' }: NoteListProps) {
  const { notes, loading, error, removeNote } = useNotes();

  const handleDelete = async (id: string) => {
    try {
      await removeNote(id);
      toast.success('노트가 아카이브로 이동되었습니다.');
    } catch (e) {
      console.error(e);
      toast.error('삭제에 실패했습니다');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-foreground-subtle)' }}>
          불러오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="불러오기 실패"
        description={error}
      />
    );
  }

  // 검색 + 태그 필터 적용
  const filtered = notes.filter((note) => {
    if (note.archivedAt != null) return false; // 아카이브된 노트 숨김

    const matchSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTag =
      activeTag === 'All' || (note.tags ?? []).includes(activeTag);

    return matchSearch && matchTag;
  });

  if (filtered.length === 0) {
    const isFiltered = searchQuery || activeTag !== 'All';
    return (
      <EmptyState
        icon={isFiltered ? '🔍' : '📝'}
        title={isFiltered ? '검색 결과가 없습니다' : '노트가 없습니다'}
        description={
          isFiltered
            ? '다른 키워드나 태그로 다시 검색해 보세요.'
            : 'FAB(+) 버튼을 눌러 첫 번째 노트를 만들어 보세요.'
        }
      />
    );
  }

  return (
    <>
      {/* 노트 수 레이블 */}
      <p
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          color: 'var(--color-foreground-subtle)',
          marginBottom: 4,
        }}
      >
        노트 {filtered.length}개
      </p>

      {filtered.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={onSelect}
          onDelete={handleDelete}
        />
      ))}
    </>
  );
}
