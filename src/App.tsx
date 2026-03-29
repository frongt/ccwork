import { useState } from 'react';
import { NotesProvider, useNotes } from './context/NotesContext';
import { Layout } from './components/Layout';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { TagFilter } from './components/TagFilter';
import { extractAllTags } from './utils/noteFilters';

function AppContent() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { notes } = useNotes();

  const allTags = extractAllTags(notes);

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setIsCreating(false);
  };

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setIsCreating(true);
  };

  const handleDone = () => {
    setIsCreating(false);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <Layout
      onNewNote={handleNewNote}
      sidebar={
        <>
          <NoteList
            selectedNoteId={selectedNoteId}
            onSelect={handleSelectNote}
            selectedTags={selectedTags}
          />
          <TagFilter allTags={allTags} selectedTags={selectedTags} onToggle={handleToggleTag} />
        </>
      }
      main={
        <NoteEditor selectedNoteId={selectedNoteId} isCreating={isCreating} onDone={handleDone} />
      }
    />
  );
}

function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;
