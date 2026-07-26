/**
 * Motion that needs no JavaScript.
 *
 * Deliberately not a client component: this runs on CSS alone, so it works
 * with JS disabled, costs nothing at hydration, and cannot hide content the
 * way an observer-driven reveal can.
 */

/**
 * Splits a line into words that rise and unblur in sequence.
 *
 * The words stay in the DOM as plain text inside whatever heading wraps this,
 * so screen readers and crawlers read the sentence normally.
 */
export function KineticText({
  text,
  delay = 0,
  step = 70,
  className = "",
}: {
  text: string;
  /** Milliseconds before the first word. */
  delay?: number;
  /** Milliseconds between words. */
  step?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="word-rise"
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {word}
          {/* Regular space, and one after the last word too: a
              non-breaking space blocks wrapping, and omitting the
              trailing one fuses lines split by <br/>. */}
          {" "}
        </span>
      ))}
    </span>
  );
}
