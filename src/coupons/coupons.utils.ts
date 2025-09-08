/**
 * Returns true if the two sets are overlapping.
 */
export function areSetsOverlapping(
  setA: Set<string>,
  setB: Set<string>
): boolean {
  for (const el of setA) {
    if (setB.has(el)) return true;
  }
  return false;
}

/**
 * Removes subsets and duplicates from the combinations array.
 */
export const filterSubsetsAndDuplicates = (
  combinations: number[][]
): number[][] => {
  const result: number[][] = [];
  // Remove duplicates from combinations and sort them by length
  const sortedCombinations = combinations
    .map((s) => [...new Set(s)])
    .sort((a, b) => b.length - a.length);

  // Only add combo to result if it's not a subset of a previous combo.
  // This only works because the combinations are sorted descending by length.
  for (const combo of sortedCombinations) {
    const isSubsetOfPrevious = result.some((existing) =>
      combo.every((item) => existing.includes(item))
    );
    if (!isSubsetOfPrevious) {
      result.push(combo);
    }
  }
  return result;
};
