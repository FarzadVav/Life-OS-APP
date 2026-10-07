/**
 * Utilities for TipTap rich text handling and plain-text fallbacks
 */

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function isRichTextEmpty(html: string | null | undefined): boolean {
  if (!html) return true;
  const stripped = stripHtml(html);
  return stripped.length === 0;
}

/**
 * Normalizes initial raw text (plain text or existing HTML) into HTML for TipTap.
 */
export function toEditorHtml(raw: string | null | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // If already contains HTML tags like <p>, <h1>, etc., return as is
  if (/<(p|h1|h2|h3|ul|ol|li|div|blockquote)[\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }

  // Convert plain text with newlines into paragraphs
  return trimmed
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => {
      const formatted = paragraph.replace(/\r?\n/g, "<br>");
      return `<p>${formatted}</p>`;
    })
    .join("");
}
