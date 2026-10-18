import { EntityRepository } from '@mikro-orm/sqlite';
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
    createdAt: journal.createdAt instanceof Date ? journal.createdAt.toISOString() : String(journal.createdAt),
  };
}

export class JournalRepository extends EntityRepository<Journal> {
  async findAllJournals(
    userId?: number,
    options?: { limit?: number; offset?: number },
  ): Promise<Journal[]> {
    const where: Record<string, unknown> = {};
    if (userId) {
      where.user = userId;
    }

    return this.find(where, {
      orderBy: { createdAt: 'DESC' },
      limit: options?.limit,
      offset: options?.offset,
    });
  }

  async findByCategory(category: JournalCategory | string, userId?: number): Promise<Journal[]> {
    const matchedCategory =
      Object.values(JournalCategory).find(
        (c) => c.toLowerCase() === category.toLowerCase(),
      ) ?? JournalCategory.LOGS;

    const where: Record<string, unknown> = { type: matchedCategory };
    if (userId) {
      where.user = userId;
    }

    return this.find(where, { orderBy: { createdAt: 'DESC' } });
  }

  async findById(id: number, userId?: number): Promise<Journal | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    return this.findOne(where);
  }

  async searchJournals(query: string, userId?: number): Promise<Journal[]> {
    const cleanQuery = query.trim().toLowerCase();
    const where: Record<string, unknown> = {
      $or: [
        { title: { $like: `%${cleanQuery}%` } },
        { content: { $like: `%${cleanQuery}%` } },
      ],
    };

    if (userId) {
      where.user = userId;
    }

    return this.find(where, { orderBy: { createdAt: 'DESC' } });
  }

  async createJournal(data: CreateJournalData): Promise<Journal> {
    const user = data.userId ? this.em.getReference(User, data.userId) : undefined;
    const journal = this.create({
      title: data.title.trim(),
      content: data.content,
      type: data.type as unknown as JournalCategory,
      user,
    });
    await this.em.flush();
    return journal;
  }

  async updateJournal(id: number, data: UpdateJournalData, userId?: number): Promise<Journal | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const journal = await this.findOne(where);
    if (!journal) {
      return null;
    }

    this.assign(journal, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.type !== undefined ? { type: data.type as unknown as JournalCategory } : {}),
    });

    await this.em.flush();
    return journal;
  }

  async deleteJournal(id: number, userId?: number): Promise<boolean> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const journal = await this.findOne(where);
    if (!journal) {
      return false;
    }

    this.em.remove(journal);
    await this.em.flush();
    return true;
  }

  async getCategoryCounts(userId?: number): Promise<Record<JournalCategory, number>> {
    const baseWhere = userId ? { user: userId } : {};

    const categories = Object.values(JournalCategory);
    const counts = await Promise.all(
      categories.map((cat) => this.count({ ...baseWhere, type: cat })),
    );

    const result = {} as Record<JournalCategory, number>;
    categories.forEach((cat, idx) => {
      result[cat] = counts[idx];
    });

    return result;
  }
}
