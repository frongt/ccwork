import { useState, useMemo } from 'react';
import { useNotes } from '../context/NotesContext';
import { SearchBar } from './shared/SearchBar';
import { FilterChip } from './shared/FilterChip';
import { NoteList } from './NoteList';
import { MobileLayout } from './shared/MobileLayout';
import { TopAppBar } from './shared/TopAppBar';
import { BottomNav } from './shared/BottomNav';
import type { BottomNavItem } from './shared/BottomNav';
import { FAB } from './shared/FAB';

interface NoteListScreenProps {
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onArchive: () => void;
}

/* ---- 아이콘 ---- */
function HamburgerIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <rect width="18" height="2" rx="1" fill="currentColor" />
      <rect y="5" width="18" height="2" rx="1" fill="currentColor" />
      <rect y="10" width="18" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function NotesNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden="true">
      <path
        d="M10 1H2C1.45 1 1 1.45 1 2v16c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6l-4-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.15 : 0}
      />
      <path d="M10 1v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="4.5" y1="10" x2="11.5" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="4.5" y1="13.5" x2="11.5" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArchiveNavIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function SettingsNavIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

/* ---- NoteListScreen ---- */
export function NoteListScreen({
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onArchive,
}: NoteListScreenProps) {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [showSearch, setShowSearch] = useState(false);

  // 전체 노트에서 중복 없이 태그 추출
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((n) => n.tags?.forEach((t) => tagSet.add(t)));
    return ['All', ...Array.from(tagSet)];
  }, [notes]);

  const navItems: BottomNavItem[] = [
    {
      id: 'notes',
      label: 'Notes',
      icon: (active) => <NotesNavIcon active={active} />,
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: () => <ArchiveNavIcon />,
      onClick: onArchive,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: () => <SettingsNavIcon />,
    },
  ];

  return (
    <MobileLayout
      header={
        <TopAppBar
          title="Lumina Notes"
          left={
            <button className="icon-btn" aria-label="메뉴 열기">
              <HamburgerIcon />
            </button>
          }
          right={
            <button
              className="icon-btn"
              aria-label="검색"
              onClick={() => setShowSearch((v) => !v)}
              style={
                showSearch
                  ? { background: 'var(--color-accent-subtle)', color: 'var(--color-primary)' }
                  : undefined
              }
            >
              <SearchIcon />
            </button>
          }
        />
      }
      fab={<FAB onClick={onNewNote} aria-label="새 노트 만들기" icon={<PlusIcon />} />}
      bottomNav={<BottomNav items={navItems} activeId="notes" />}
    >
      {/* 검색 + 필터 섹션 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '8px 20px 0' }}>
        {showSearch && (
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search your thoughts..."
          />
        )}

        {/* 수평 스크롤 필터 칩 */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
          {allTags.map((tag) => (
            <FilterChip
              key={tag}
              label={tag === 'All' ? 'All' : `#${tag}`}
              isActive={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </div>
      </section>

      {/* 노트 카드 목록 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 20px' }}>
        <NoteList
          selectedNoteId={selectedNoteId}
          onSelect={onSelectNote}
          searchQuery={searchQuery}
          activeTag={activeTag}
        />
      </section>
    </MobileLayout>
  );
}
