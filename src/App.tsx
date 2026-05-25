import { useState } from 'react';
import { NotesProvider } from './context/NotesContext';
import { AppToaster } from './components/AppToaster';
import { NoteListScreen } from './components/NoteListScreen';
import { NoteEditor } from './components/NoteEditor';
import { ArchiveScreen } from './components/ArchiveScreen';

type AppView = 'list' | 'editor' | 'archive';

export function App() {
  const [view, setView] = useState<AppView>('list');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [returnView, setReturnView] = useState<'list' | 'archive'>('list');

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setIsCreating(false);
    setIsReadOnly(false);
    setReturnView('list');
    setView('editor');
  };

  const handleSelectArchivedNote = (id: string) => {
    setSelectedNoteId(id);
    setIsCreating(false);
    setIsReadOnly(true);
    setReturnView('archive');
    setView('editor');
  };

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setIsCreating(true);
    setIsReadOnly(false);
    setReturnView('list');
    setView('editor');
  };

  const handleDone = () => {
    setIsCreating(false);
    setIsReadOnly(false);
    setView(returnView);
  };

  const handleGoToArchive = () => {
    setView('archive');
  };

  const handleBackFromArchive = () => {
    setView('list');
  };

  return (
    <NotesProvider>
      <div
        style={{
          maxWidth: 390,
          margin: '0 auto',
          minHeight: '100dvh',
          background: 'var(--color-background-app)',
          position: 'relative',
          isolation: 'isolate',
        }}
      >
        {view === 'list' && (
          <NoteListScreen
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onNewNote={handleNewNote}
            onArchive={handleGoToArchive}
          />
        )}
        {view === 'editor' && (
          <NoteEditor
            selectedNoteId={selectedNoteId}
            isCreating={isCreating}
            onDone={handleDone}
            isReadOnly={isReadOnly}
          />
        )}
        {view === 'archive' && (
          <ArchiveScreen
            onSelectNote={handleSelectArchivedNote}
            onBack={handleBackFromArchive}
          />
        )}
      </div>
      <AppToaster />
    </NotesProvider>
  );
}
