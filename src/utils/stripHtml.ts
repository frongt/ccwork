/**
 * Strips HTML tags and normalizes common HTML entities in a string.
 *
 * Converts the input to plain text by removing HTML tags, decoding common entities
 * (`&nbsp;`, `&amp;`, `&lt;`, `&gt;`, `&quot;`), collapsing consecutive whitespace into
 * single spaces, and trimming leading/trailing whitespace.
 *
 * @param html - The string that may contain HTML markup and entities
 * @returns The resulting plain-text string with tags removed, selected entities decoded, whitespace collapsed, and trimmed
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
