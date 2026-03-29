interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export function TagFilter({ allTags, selectedTags, onToggle }: TagFilterProps) {
  if (allTags.length === 0) return null;

  return (
    <div data-testid="tag-filter" className="pt-3 mt-3 border-t border-border">
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground px-1 pb-2">
        태그 필터
      </p>
      <div className="flex flex-wrap gap-1.5 px-1">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-foreground text-card border-foreground'
                  : 'bg-muted text-muted-foreground border-border hover:border-foreground/30'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
