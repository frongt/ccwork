import { useNotes } from '../context/NotesContext';
import { NoteItem } from './NoteItem';
import { MobileLayout } from './shared/MobileLayout';
import { TopAppBar } from './shared/TopAppBar';
import { EmptyState } from './shared/EmptyState';

interface ArchiveScreenProps {
  onSelectNote: (id: string) => void;
  onBack: () => void;
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

export function ArchiveScreen({ onSelectNote, onBack }: ArchiveScreenProps) {
  const { notes, loading, error } = useNotes();

  const archivedNotes = notes.filter((n) => n.archivedAt != null);

  if (loading) {
    return (
      <MobileLayout
        header={
          <TopAppBar
            title="아카이브"
            left={
              <button className="icon-btn" aria-label="뒤로 가기" onClick={onBack}>
                <ChevronLeftIcon />
              </button>
            }
          />
        }
      >
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-foreground-subtle)' }}>
            불러오는 중...
          </p>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout
        header={
          <TopAppBar
            title="아카이브"
            left={
              <button className="icon-btn" aria-label="뒤로 가기" onClick={onBack}>
                <ChevronLeftIcon />
              </button>
            }
          />
        }
      >
        <EmptyState icon="⚠️" title="불러오기 실패" description={error} />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      header={
        <TopAppBar
          title="아카이브"
          left={
            <button className="icon-btn" aria-label="뒤로 가기" onClick={onBack}>
              <ChevronLeftIcon />
            </button>
          }
        />
      }
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 20px' }}>
        {archivedNotes.length === 0 ? (
          <EmptyState
            icon="📦"
            title="보관된 노트가 없습니다"
            description="삭제한 노트가 여기에 보관됩니다."
          />
        ) : (
          <>
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
              보관된 노트 {archivedNotes.length}개
            </p>
            {archivedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isSelected={false}
                onSelect={onSelectNote}
                onDelete={() => {}}
                isReadOnly
              />
            ))}
          </>
        )}
      </section>
    </MobileLayout>
  );
}
