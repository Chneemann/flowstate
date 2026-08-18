/**
 * @file components/ui/HighlightText.tsx
 * @description Component to highlight matching search query terms within a text string.
 */

/**
 * Properties for the HighlightText component.
 *
 * @interface HighlightTextProps
 * @property {string | null} [text] - The full text string to render and search within.
 * @property {string} [query] - The search query term to highlight within the text.
 * @property {string} [className] - Optional CSS classes applied to the wrapping container element.
 */
interface HighlightTextProps {
  text?: string | null;
  query?: string;
  className?: string;
}

/**
 * Renders a text string with case-insensitive highlighted search query matches wrapped in a marked element.
 *
 * @param {HighlightTextProps} props - The component props.
 * @returns {JSX.Element | null} The rendered text component with highlighted query terms, or null if no text is provided.
 */
export default function HighlightText({
  text,
  query,
  className = "",
}: HighlightTextProps) {
  if (!text) return null;
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Regular expression with escaping for special characters, case-insensitive ('gi')
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="bg-primary/20 text-primary font-semibold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
}
