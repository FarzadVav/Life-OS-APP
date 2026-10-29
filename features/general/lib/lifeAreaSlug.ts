/**
 * URL segment shared by the skills and framework area pages for records whose
 * life area is not set.
 */
export const UNSET_LIFE_AREA_SLUG = 'not-set';

/**
 * Absent or unparseable means every area,
 * UNSET_LIFE_AREA_SLUG/'0'/'none' means no life area, otherwise the area id.
 */
export function parseLifeAreaSlug(
  raw?: string | null,
): number | null | undefined {
  if (raw === null || raw === undefined) return undefined;
  if (raw === '' || raw === 'none' || raw === '0' || raw === UNSET_LIFE_AREA_SLUG) {
    return null;
  }

  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}
