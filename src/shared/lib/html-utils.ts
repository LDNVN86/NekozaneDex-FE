export function cleanHtml(html: string): string {
  if (!html) return "";

  return html
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<p><br\s*\/?><\/p>/gi, "")
    .replace(/<(\w+)>\s*<\/\1>/gi, "")
    .trim();
}

export function stripHtml(html: string): string {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

export function isHtmlEmpty(html: string): boolean {
  if (!html) return true;

  const stripped = stripHtml(html);
  return stripped.length === 0;
}

export function truncateHtml(html: string, maxLength: number): string {
  const text = stripHtml(html);

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trim() + "...";
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";

  const allowedTags = [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "a",
  ];

  let cleaned = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  cleaned = cleaned.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ""
  );

  cleaned = cleaned.replace(/\s*on\w+="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*on\w+='[^']*'/gi, "");

  cleaned = cleaned.replace(/javascript:/gi, "");

  cleaned = cleaned.replace(/&nbsp;/g, " ");

  return cleaned.trim();
}
