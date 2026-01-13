"use client";

import { sanitizeHtml } from "@/shared/lib/html-utils";

interface HtmlContentProps {
  html: string;
  className?: string;
  fallback?: string;
}

/**
 * Safely render HTML content from rich text editor
 * Uses sanitizeHtml to prevent XSS attacks
 */
export function HtmlContent({
  html,
  className = "",
  fallback = "",
}: HtmlContentProps) {
  if (!html || html.trim() === "") {
    if (fallback) {
      return <span className={className}>{fallback}</span>;
    }
    return null;
  }

  const sanitized = sanitizeHtml(html);

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
