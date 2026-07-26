/**
 * Projected belt-promotion dates — the digital equivalent of the sheet posted
 * in the dojo.
 *
 * ⚠️ THE NUMBERS IN `BELT_REQUIREMENTS` ARE PLACEHOLDERS. The school has a
 * specific time in rank for each belt; until those are supplied every entry
 * below is deliberately identical, so nothing here should be mistaken for
 * real policy. Fill in the table and flip `PROMOTION_DATA_CONFIRMED` to true —
 * that is the only change needed, and the "estimated" caveats disappear from
 * the UI automatically.
 *
 * `RECOMMENDED_CLASSES_PER_WEEK` is NOT a guess: the official 2024-25
 * schedule PDF (docs/2024-25-weekly-schedule.pdf) states "We recommend
 * attending 2 classes per week".
 */

export interface BeltRequirement {
  /**
   * Classes to log at this belt before a promotion slip is issued. Per the
   * school, attendance is what drives promotion — hit the count and you get a
   * slip, which lets you advance at the next promotion.
   */
  classesRequired: number;
}

/** Real figure, from the school's published schedule. */
export const RECOMMENDED_CLASSES_PER_WEEK = 2;

/**
 * Real figure, from the school's FAQ: "Color Belt Promotions are once per
 * month, usually the second Saturday of the month." Projections snap forward
 * to one of these, since a student is promoted on a promotion day rather than
 * the day they happen to meet the requirements.
 */
export const PROMOTION_WEEK_OF_MONTH = 2;
export const PROMOTION_WEEKDAY = 6; // Saturday

/** The Nth given weekday of a month, e.g. the 2nd Saturday. */
function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  nth: number
): Date {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (nth - 1) * 7);
}

/** The first promotion day on or after `from`. */
export function nextPromotionDay(from: Date): Date {
  const candidate = nthWeekdayOfMonth(
    from.getFullYear(),
    from.getMonth(),
    PROMOTION_WEEKDAY,
    PROMOTION_WEEK_OF_MONTH
  );
  if (candidate >= from) return candidate;
  return nthWeekdayOfMonth(
    from.getFullYear(),
    from.getMonth() + 1,
    PROMOTION_WEEKDAY,
    PROMOTION_WEEK_OF_MONTH
  );
}

/** Set to true once BELT_REQUIREMENTS holds the school's actual policy. */
export const PROMOTION_DATA_CONFIRMED = false;

const PLACEHOLDER: BeltRequirement = { classesRequired: 24 };

/**
 * Requirements to promote OUT of each belt, keyed by the belt held now.
 * Every value is currently PLACEHOLDER — see the warning above.
 */
export const BELT_REQUIREMENTS: Record<string, BeltRequirement> = {
  White: PLACEHOLDER,
  Yellow: PLACEHOLDER,
  "Sr. Yellow": PLACEHOLDER,
  Green: PLACEHOLDER,
  "Sr. Green": PLACEHOLDER,
  Blue: PLACEHOLDER,
  "Sr. Blue": PLACEHOLDER,
  Red: PLACEHOLDER,
  "Sr. Red": PLACEHOLDER,
  Bodan: PLACEHOLDER,
  "Black 1st Dan": PLACEHOLDER,
  "Black 2nd Dan": PLACEHOLDER,
  "Black 3rd Dan": PLACEHOLDER,
};

export function requirementFor(belt: string): BeltRequirement {
  return BELT_REQUIREMENTS[belt] ?? PLACEHOLDER;
}

const DAY_MS = 86_400_000;

export interface PromotionProjection {
  /** Classes logged since the student entered their current rank. */
  classesAttended: number;
  classesRequired: number;
  classesRemaining: number;
  /** Weeks held at the current belt so far. */
  weeksInRank: number;
  /** 0–1, how far through the class requirement they are. */
  progress: number;
  /** The student's own recent attendance rate, classes per week. */
  pacePerWeek: number;
  /** YYYY-MM-DD estimate, or null at the top of the belt order. */
  projectedDate: string | null;
  /** True once the class count is met — the promotion slip is earned. */
  slipEarned: boolean;
  nextBelt: string | null;
  /** False while BELT_REQUIREMENTS is still placeholder data. */
  confirmed: boolean;
}

/**
 * Attendance drives promotion, so this projects purely from classes: how many
 * are left, divided by the pace the student is actually training at, then
 * rounded forward to the next promotion day.
 *
 * Their own pace is used rather than the recommended two a week — a student
 * training four times a week should not be told the average timeline. Until
 * there is enough history to measure (under two weeks at the rank), it falls
 * back to the recommended pace.
 */
export function projectPromotion(opts: {
  currentBelt: string;
  belts: readonly string[];
  /** When the student entered their current rank (YYYY-MM-DD). */
  inRankSince: string;
  /** This student's attendance dates (YYYY-MM-DD), any order. */
  attendanceDates: string[];
  today?: Date;
}): PromotionProjection {
  const { currentBelt, belts, inRankSince, attendanceDates } = opts;
  const today = opts.today ?? new Date();

  const idx = belts.indexOf(currentBelt);
  const nextBelt = idx >= 0 && idx < belts.length - 1 ? belts[idx + 1] : null;

  const { classesRequired } = requirementFor(currentBelt);
  const classesAttended = attendanceDates.filter((d) => d >= inRankSince).length;
  const classesRemaining = Math.max(0, classesRequired - classesAttended);

  const start = new Date(`${inRankSince}T00:00:00`);
  const elapsedWeeks = (today.getTime() - start.getTime()) / (7 * DAY_MS);
  const weeksInRank = Math.max(0, Math.floor(elapsedWeeks));

  // Measure their real pace once there is enough history to be meaningful.
  const pacePerWeek =
    elapsedWeeks >= 2 && classesAttended > 0
      ? classesAttended / elapsedWeeks
      : RECOMMENDED_CLASSES_PER_WEEK;

  const weeksLeft = classesRemaining / pacePerWeek;
  const requirementsMet = new Date(today.getTime() + weeksLeft * 7 * DAY_MS);
  const projected = nextPromotionDay(requirementsMet);

  return {
    classesAttended,
    classesRequired,
    classesRemaining,
    weeksInRank,
    progress: Math.min(1, classesAttended / classesRequired),
    pacePerWeek: Math.round(pacePerWeek * 10) / 10,
    projectedDate: nextBelt ? projected.toISOString().slice(0, 10) : null,
    slipEarned: classesAttended >= classesRequired,
    nextBelt,
    confirmed: PROMOTION_DATA_CONFIRMED,
  };
}
