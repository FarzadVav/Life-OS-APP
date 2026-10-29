import type { LifeArea } from '../types';

/**
 * Archived areas only stay in the list when a record already belongs to one, so
 * nothing new can be assigned to them while editing still shows the current area.
 */
export function selectableLifeAreas(
  lifeAreas: readonly LifeArea[],
  selectedId?: number | null,
): LifeArea[] {
  return lifeAreas.filter(
    (area) => area.active !== false || area.id === selectedId,
  );
}
