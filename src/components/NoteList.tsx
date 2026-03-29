import { useNotes } from '../context/NotesContext';
import { NoteItem } from './NoteItem';
import { filterNotesByTags } from '../utils/noteFilters';

interface NoteListProps {
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  selectedTags: string[];
}

export function NoteList({ selectedNoteId, onSelect, selectedTags }: NoteListProps) {
  const { notes, loading, error, removeNote } = useNotes();

  if (loading) {
    return <p className="text-sm text-muted-foreground text-center py-8">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive text-center py-8">오류: {error}</p>;
  }

  if (notes.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">노트가 없습니다</p>;
  }

  const filteredNotes = filterNotesByTags(notes, selectedTags);

  return (
    <>
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground px-1 pb-1">
        노트 {filteredNotes.length}개
      </p>
      {filteredNotes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={onSelect}
          onDelete={removeNote}
        />
      ))}
    </>
  );
}
