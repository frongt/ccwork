import { Note } from '../types/note';

export function extractAllTags(notes: Note[]): string[] {
  const tags = notes.flatMap((n) => n.tags);
  return [...new Set(tags)].sort();
}

export function filterNotesByTags(notes: Note[], selectedTags: string[]): Note[] {
  if (selectedTags.length === 0) return notes;
  return notes.filter((note) => note.tags.some((tag) => selectedTags.includes(tag)));
}
