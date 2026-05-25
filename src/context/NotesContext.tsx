import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note } from '../types/note';
import * as api from '../api/notes';
import { migrateContent } from '../utils/migrateContent';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  addNote: (title: string, content: string, tags: string[]) => Promise<void>;
  editNote: (id: string, updates: Partial<Note>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

/**
 * Provides NotesContext to descendant components and manages the notes collection, loading state, error state, and CRUD handlers.
 *
 * On mount, loads notes from the API and applies `migrateContent` to each note's `content`. Exposes `addNote`, `editNote`, and `removeNote` handlers that update both the remote API and local state.
 *
 * @param children - React nodes to be rendered within the provider
 * @returns A React provider element that supplies notes, loading, error, and CRUD handlers to its descendants
 */
export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .fetchNotes()
      .then((notes) => setNotes(notes.map((n) => ({ ...n, content: migrateContent(n.content) }))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addNote = async (title: string, content: string, tags: string[]) => {
    const newNote = await api.createNote({ title, content, tags });
    setNotes((prev) => [...prev, newNote]);
  };

  const editNote = async (id: string, updates: Partial<Note>) => {
    const updated = await api.updateNote(id, updates);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
  };

  const removeNote = async (id: string) => {
    const archived = await api.deleteNote(id);
    setNotes((prev) => prev.map((n) => (n.id === id ? archived : n)));
  };

  return (
    <NotesContext.Provider value={{ notes, loading, error, addNote, editNote, removeNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
