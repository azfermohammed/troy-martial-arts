/**
 * Projected belt-promotion dates — the digital equivalent of the sheet posted
 * in the dojo.
 *
 * ⚠️ THE THRESHOLDS BELOW ARE PLACEHOLDERS AND MUST BE CONFIRMED WITH THE
 * SCHOOL. Troy Martial Arts does not publish its promotion requirements, so
 * `classesRequired` and `minWeeksInRank` are reasonable defaults, not the
 * dojang's real policy. Projections are labelled "estimated" in the UI for
 * that reason. Correct these two numbers and every projection follows.
 *
 * `recommendedClassesPerWeek` is NOT a guess: the official 2024-25 schedule
 * PDF (docs/2024-25-weekly-schedule.pdf) states "We recommend attending 2
 * classes per week".
 */
export const PROMOTION_RULES = {
  classesRequired: 24,
  minWeeksInRank: 8,
  recommendedClassesPerWeek: 2,
} as const;

const DAY_MS = 86_400_000;

export interface PromotionProjection {
  /** Classes logged since the student entered their current rank. */
  classesAttended: number;
  classesRequired: number;
  /** 0–1, how far through the class requirement they are. */
  progress: number;
  /** YYYY-MM-DD estimate, or null at the top of the belt order. */
  projectedDate: string | null;
  /** True once both the class and time-in-rank requirements are met. */
  eligibleNow: boolean;
  nextBelt: string | null;
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

  const classesAttended = attendanceDates.filter((d) => d >= inRankSince).length;
  const { classesRequired, minWeeksInRank, recommendedClassesPerWeek } =
    PROMOTION_RULES;

  const remaining = Math.max(0, classesRequired - classesAttended);
  const weeksOfClassesLeft = remaining / recommendedClassesPerWeek;

  const start = new Date(`${inRankSince}T00:00:00`);
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
    progress: Math.min(1, classesAttended / classesRequired),
    projectedDate: nextBelt ? projected.toISOString().slice(0, 10) : null,
    eligibleNow,
    nextBelt,
  };
}
