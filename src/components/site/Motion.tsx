import type { ReactNode } from "react";

/**
 * Motion that needs no JavaScript.
 *
 * Deliberately not a client component: these run on CSS alone, so they work
 * with JS disabled, cost nothing at hydration, and cannot hide content the way
 * an observer-driven reveal can.
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

/**
 * Edge-faded ticker that scrolls forever and pauses on hover.
 *
 * Items render twice so translating the track by half its width loops
 * seamlessly; the duplicate is aria-hidden so the list is announced once.
 */
export function Marquee({
  items,
  durationSeconds = 48,
  className = "",
}: {
  items: ReactNode[];
  durationSeconds?: number;
  className?: string;
}) {
  const row = (duplicate: boolean) => (
    <div className="flex shrink-0" aria-hidden={duplicate || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          {item}
          <span aria-hidden className="mx-6 text-gold/60">
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={
          { "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties
        }
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
