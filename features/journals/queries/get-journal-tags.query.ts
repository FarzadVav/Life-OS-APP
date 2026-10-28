import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
import { serializeJournalTag } from '../repositories';
import type { JournalTag, JournalCategory } from '../types';

export async function getJournalTagsQuery(
  category?: JournalCategory | string,
): Promise<JournalTag[]> {
  const userId = await requireUserId();

  return withRequestContext(async ({ journalTag }) => {
    const entities = category
      ? await journalTag.findByCategory(category, userId)
      : await journalTag.findAllTags(userId);

    return entities.map((item) => serializeJournalTag(item));
  });
}

export async function getJournalTagByIdQuery(
  id: number,
): Promise<JournalTag | null> {
  const userId = await requireUserId();

  return withRequestContext(async ({ journalTag }) => {
    const entity = await journalTag.findById(id, userId);
    return entity ? serializeJournalTag(entity) : null;
  });
}
