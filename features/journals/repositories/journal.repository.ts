import { EntityRepository } from '@mikro-orm/postgresql';
import type { FilterQuery } from '@mikro-orm/core';
import { JournalCategory } from '@/db/entities/enums';
import { User } from '@/db/entities/User';
import type { Journal } from '@/db/entities/Journal';

import type { CreateJournalData, UpdateJournalData, Journal as JournalDto } from '@/features/journals/types';

export type { CreateJournalData, UpdateJournalData };

/**
 * Safely transforms a MikroORM Journal entity into a plain Journal DTO object.
 */
export function serializeJournal(journal: Journal): JournalDto {
  return {
    id: journal.id,
    title: journal.title,
    content: journal.content,
    type: journal.type as unknown as JournalDto['type'],
    tag: journal.tag ?? null,
    createdAt: journal.createdAt instanceof Date ? journal.createdAt.toISOString() : String(journal.createdAt),
  };
}

/**
 * Every method scopes to `userId` unconditionally: a journal that the acting
 * user does not own is indistinguishable from one that does not exist.
 */
export class JournalRepository extends EntityRepository<Journal> {
  async findAllJournals(
    userId: number,
    options?: { limit?: number; offset?: number },
  ): Promise<Journal[]> {
    return this.find({ user: userId }, {
      orderBy: [{ sortNumber: 'ASC' }, { createdAt: 'DESC' }],
      limit: options?.limit,
      offset: options?.offset,
    });
  }

  async findByCategory(
    category: JournalCategory | string,
    userId: number,
    tag?: string | null,
  ): Promise<Journal[]> {
    const matchedCategory =
      Object.values(JournalCategory).find(
        (c) => c.toLowerCase() === category.toLowerCase(),
      ) ?? JournalCategory.LOGS;

    const where: FilterQuery<Journal> = { type: matchedCategory, user: userId };
    if (tag && tag.toLowerCase() !== 'all') {
      where.tag = tag;
    }

    return this.find(where, { orderBy: [{ sortNumber: 'ASC' }, { createdAt: 'DESC' }] });
  }

  async findById(id: number, userId: number): Promise<Journal | null> {
    return this.findOne({ id, user: userId });
  }

  async searchJournals(query: string, userId: number): Promise<Journal[]> {
    const cleanQuery = query.trim().toLowerCase();
    const where: FilterQuery<Journal> = {
      $or: [
        { title: { $like: `%${cleanQuery}%` } },
        { content: { $like: `%${cleanQuery}%` } },
      ],
      user: userId,
    };

    return this.find(where, { orderBy: { createdAt: 'DESC' } });
  }

  async createJournal(data: CreateJournalData, userId: number): Promise<Journal> {
    const journal = this.create({
      title: data.title.trim(),
      content: data.content,
      type: data.type as unknown as JournalCategory,
      tag: data.tag ? data.tag.trim() : null,
      user: this.em.getReference(User, userId),
    });
    await this.em.flush();
    return journal;
  }

  async updateJournal(id: number, data: UpdateJournalData, userId: number): Promise<Journal | null> {
    const journal = await this.findOne({ id, user: userId });
    if (!journal) {
      return null;
    }

    this.assign(journal, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.type !== undefined ? { type: data.type as unknown as JournalCategory } : {}),
      ...(data.tag !== undefined ? { tag: data.tag ? data.tag.trim() : null } : {}),
    });

    await this.em.flush();
    return journal;
  }

  async deleteJournal(id: number, userId: number): Promise<boolean> {
    const journal = await this.findOne({ id, user: userId });
    if (!journal) {
      return false;
    }

    this.em.remove(journal);
    await this.em.flush();
    return true;
  }

  async getCategoryCounts(userId: number): Promise<Record<JournalCategory, number>> {
    const categories = Object.values(JournalCategory);
    const counts = await Promise.all(
      categories.map((cat) => this.count({ user: userId, type: cat })),
    );

    const result = {} as Record<JournalCategory, number>;
    categories.forEach((cat, idx) => {
      result[cat] = counts[idx];
    });

    return result;
  }
}
