/**
 * Utility functions for text formatting and cleanup
 */

/**
 * Clean markdown formatting from text for display in plain text contexts
 * Removes common markdown syntax like **, __, ##, etc.
 * @param {string} text - Text with markdown formatting
 * @returns {string} - Cleaned text without markdown syntax
 */
export function cleanMarkdown(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text;

  // Remove bold markdown (**text** or __text__)
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__(.+?)__/g, '$1');

  // Remove italic markdown (*text* or _text_)
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
  cleaned = cleaned.replace(/_(.+?)_/g, '$1');

  // Remove headers (### text)
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '$1');

  // Remove inline code (`text`)
  cleaned = cleaned.replace(/`(.+?)`/g, '$1');

  // Remove horizontal rules (---, ___, ***)
  cleaned = cleaned.replace(/^[-_*]{3,}$/gm, '');

  // Remove list markers (-, *, +) at start of lines
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');

  // Remove numbered list markers (1., 2., etc.)
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');

  return cleaned.trim();
}

/**
 * Format markdown text for better display while keeping structure
 * Converts markdown to more readable plain text with preserved formatting
 * @param {string} text - Markdown text
 * @returns {string} - Formatted plain text
 */
export function formatMarkdownForDisplay(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // For now, just clean markdown but preserve line breaks and structure
  // This keeps the text readable in a <pre> tag
  return cleanMarkdown(text);
}
