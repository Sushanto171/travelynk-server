/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const calculateMatchPercentage = (
  plan: any,
  search: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    interests?: string[];
  }
) => {
  let score = 0;

  // ✅ 1. Destination Match (40%)
  if (
    search.destination &&
    plan.destination
      .toLowerCase()
      .includes(search.destination.toLowerCase())
  ) {
    score += 40;
  }

  // ✅ 2. Date Overlap (30%)
  if (search.startDate && search.endDate) {
    const searchStart = new Date(search.startDate);
    const searchEnd = new Date(search.endDate);

    const planStart = new Date(plan.start_date);
    const planEnd = new Date(plan.end_date);

    const isOverlapping =
      planStart <= searchEnd && planEnd >= searchStart;

    if (isOverlapping) {
      score += 30;
    }
  }

  // ✅ 3. Interest Match (30%)
  if (search.interests?.length && plan.owner?.interests?.length) {
    const matchedInterests = plan.owner.interests.filter((interest: string) =>
      search.interests!.includes(interest)
    );

    if (matchedInterests.length > 0) {
      const interestMatchRatio =
        matchedInterests.length / search.interests.length;

      score += Math.round(30 * interestMatchRatio);
    }
  }

  return Math.min(score, 100);
};
