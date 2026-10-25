import type { EntityRepository } from '@mikro-orm/postgresql';

import { LifeArea } from '@/db/entities/LifeArea';
import { ForbiddenReferenceError } from './errors';

/**
 * Taken from the repository base class so it matches `this.em` exactly —
 * driver-specific entity manager types are not mutually assignable.
 */
type RepositoryEm = EntityRepository<LifeArea>['em'];

/**
 * Verifies in one query that every referenced LifeArea id belongs to userId.
 *
 * Client-supplied relation ids must never reach `em.getReference` unchecked:
 * MikroORM defers the lookup, so a foreign id silently links one user's record
 * to another user's area. Ids are asserted before binding, not after.
 */
export async function assertOwnedLifeAreas(
  em: RepositoryEm,
  userId: number,
  lifeAreaIds: readonly (number | null | undefined)[],
): Promise<void> {
  const ids = [
    ...new Set(
      lifeAreaIds.filter(
        (id): id is number => typeof id === 'number' && Number.isSafeInteger(id) && id > 0,
      ),
    ),
  ];

  if (ids.length === 0) {
    return;
  }

  const owned = await em.find(LifeArea, { id: { $in: ids }, user: userId }, { fields: ['id'] });
  const ownedIds = new Set(owned.map((area) => area.id));

  for (const id of ids) {
    if (!ownedIds.has(id)) {
      throw new ForbiddenReferenceError('lifeAreaId', id);
    }
  }
}
