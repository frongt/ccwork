import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note } from '../types/note';
import * as api from '../api/notes';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  addNote: (title: string, content: string, tags: string[]) => Promise<void>;
  editNote: (id: string, updates: Partial<Note>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .fetchNotes()
      .then(setNotes)
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
    await api.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
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
