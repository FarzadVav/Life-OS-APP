import { EntityRepository } from '@mikro-orm/sqlite';
import { Journal, JournalCategory, User } from '@/db/entities';

export interface CreateJournalData {
  title: string;
  content: string;
  type: JournalCategory;
  userId?: number;
}

export interface UpdateJournalData {
  title?: string;
  content?: string;
  type?: JournalCategory;
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

  async findByCategory(category: JournalCategory, userId?: number): Promise<Journal[]> {
    const where: Record<string, unknown> = { type: category };
    if (userId) {
      where.user = userId;
    }

    return this.find(where, { orderBy: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Journal | null> {
    return this.findOne({ id });
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
      type: data.type,
      user,
    });
    await this.em.flush();
    return journal;
  }

  async updateJournal(id: number, data: UpdateJournalData): Promise<Journal | null> {
    const journal = await this.findOne({ id });
    if (!journal) {
      return null;
    }

    this.assign(journal, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
    });

    await this.em.flush();
    return journal;
  }

  async deleteJournal(id: number): Promise<boolean> {
    const journal = await this.findOne({ id });
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
