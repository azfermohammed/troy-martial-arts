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
  /** Minimum weeks a student must hold this belt before grading out of it. */
  minWeeksInRank: number;
  /** Classes to log while at this belt. */
  classesRequired: number;
}

/** Real figure, from the school's published schedule. */
export const RECOMMENDED_CLASSES_PER_WEEK = 2;

/** Set to true once BELT_REQUIREMENTS holds the school's actual policy. */
export const PROMOTION_DATA_CONFIRMED = false;

const PLACEHOLDER: BeltRequirement = { minWeeksInRank: 8, classesRequired: 24 };

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
  /** Weeks held at the current belt so far. */
  weeksInRank: number;
  minWeeksInRank: number;
  /** 0–1, how far through the class requirement they are. */
  progress: number;
  /** YYYY-MM-DD estimate, or null at the top of the belt order. */
  projectedDate: string | null;
  /** True once both the class and time-in-rank requirements are met. */
  eligibleNow: boolean;
  nextBelt: string | null;
  /** False while BELT_REQUIREMENTS is still placeholder data. */
  confirmed: boolean;
}

/**
 * Projects from two constraints, whichever lands later:
 *   - time in rank: at least `minWeeksInRank` since entering the rank
 *   - classes: the remaining classes at the recommended 2-per-week pace
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

  const { minWeeksInRank, classesRequired } = requirementFor(currentBelt);
  const classesAttended = attendanceDates.filter((d) => d >= inRankSince).length;

  const remaining = Math.max(0, classesRequired - classesAttended);
  const weeksOfClassesLeft = remaining / RECOMMENDED_CLASSES_PER_WEEK;

  const start = new Date(`${inRankSince}T00:00:00`);
  const weeksInRank = Math.max(
    0,
    Math.floor((today.getTime() - start.getTime()) / (7 * DAY_MS))
  );

  const timeInRankDate = new Date(start.getTime() + minWeeksInRank * 7 * DAY_MS);
  const classPaceDate = new Date(today.getTime() + weeksOfClassesLeft * 7 * DAY_MS);

  const projected = new Date(
    Math.max(timeInRankDate.getTime(), classPaceDate.getTime())
  );
  const eligibleNow =
    classesAttended >= classesRequired && today >= timeInRankDate;

  return {
    classesAttended,
    classesRequired,
    weeksInRank,
    minWeeksInRank,
    progress: Math.min(1, classesAttended / classesRequired),
    projectedDate: nextBelt ? projected.toISOString().slice(0, 10) : null,
    eligibleNow,
    nextBelt,
    confirmed: PROMOTION_DATA_CONFIRMED,
  };
}
