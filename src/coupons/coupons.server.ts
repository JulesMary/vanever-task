import {
  filterSubsetsAndDuplicates,
  areSetsOverlapping,
} from "./coupons.utils";

export function getAllPossibleCouponCombinations<
  T extends { blockedTypes: Array<string> }
>(coupons: Array<T>): Array<Array<T>> {
  const indexCombos = getAllPossibleCouponCombinationIndexes(coupons);
  // Map each index combo back to the original coupon objects.
  return indexCombos.map((comboIdxs) => comboIdxs.map((i) => coupons[i]));
}

// Returns all valid combinations as arrays of indices
function getAllPossibleCouponCombinationIndexes<
  T extends { blockedTypes: Array<string> }
>(coupons: Array<T>): Array<Array<number>> {
  const combinations: number[][] = [];

  //Store blockedTypes as a Set for faster lookups.
  const blockedTypesSet: Array<Set<string>> = coupons.map(
    (c) => new Set((c.blockedTypes ?? []).map((t) => t.trim()))
  );

  /**
   * Recursive function to explore all combinations of cooupons.
   * - `start` is the next coupon index to consider (starting with the first coupon).
   * - `activeBlockedTypes` contains all types already blocked by coupons of the current combination.
   * - `selectedCoupons` stores the indices of all coupons that are in the current combination.
   */
  function trackCombinations(
    start: number,
    activeBlockedTypes: Set<string>,
    selectedCoupons: number[]
  ) {
    // Store every combination of selected coupons for now. Will be tidied up later.
    if (selectedCoupons.length > 0) {
      combinations.push([...selectedCoupons]);
    }

    // Go through remaining coupons
    for (let i = start; i < coupons.length; i++) {
      const nextBlockedTypes = blockedTypesSet[i];
      // Check if activeBlockedTypes overlaps with nextBlockedTypes
      // If it does, combination is not allowed -> continue with next coupon.
      if (areSetsOverlapping(activeBlockedTypes, nextBlockedTypes)) continue;

      // Add compatible coupon index to selection
      selectedCoupons.push(i);

      // Add the blocked types of the added coupon to the active blocked types.
      const updatedBlockedTypes = new Set(activeBlockedTypes);
      nextBlockedTypes.forEach((t) => updatedBlockedTypes.add(t));

      // Pass the updated blockedTypes array and the selectedCoupons to explore further coupons.
      trackCombinations(i + 1, updatedBlockedTypes, selectedCoupons);

      // Coupon i has been explored -> Gets removed to try the next one.
      selectedCoupons.pop();
    }
  }

  // Actual starting point: Start with empty set of blockedTypes and empty selection of coupons.
  trackCombinations(0, new Set(), []);

  // Filter duplicates and subsets and return the result.
  return filterSubsetsAndDuplicates(combinations);
}
