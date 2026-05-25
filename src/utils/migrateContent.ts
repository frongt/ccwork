/**
 * Convert plain-text content into HTML paragraphs.
 *
 * @param content - The input string which may be empty, already-encoded HTML, or plain text with newline-separated lines.
 * @returns An HTML string: if `content` is falsy returns `'<p></p>'`; if `content` starts with `'<'` returns `content` unchanged; otherwise returns the concatenation of non-empty lines wrapped in `<p>...</p>`, or `'<p></p>'` if there are no non-empty lines.
 */
export function migrateContent(content: string): string {
  if (!content) return '<p></p>';
  if (content.startsWith('<')) return content;
  return (
    content
      .split('\n')
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join('') || '<p></p>'
  );
}
