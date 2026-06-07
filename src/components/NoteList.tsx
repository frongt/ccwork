import { useNotes } from '../context/NotesContext';
import { NoteItem } from './NoteItem';

interface NoteListProps {
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
}

export function NoteList({ selectedNoteId, onSelect }: NoteListProps) {
  const { notes, loading, error, deleteNote } = useNotes();

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">로딩 중...</p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive text-center py-8">오류: {error}</p>
    );
  }

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">노트가 없습니다</p>
    );
  }

  return (
    <>
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground px-1 pb-1">
        노트 {notes.length}개
      </p>
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={onSelect}
          onDelete={deleteNote}
        />
      ))}
    </>
  );
}
