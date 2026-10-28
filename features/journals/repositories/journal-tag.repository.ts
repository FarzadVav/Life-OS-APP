import { EntityRepository } from '@mikro-orm/postgresql';
import { JournalCategory } from '@/db/entities/enums';
import { User } from '@/db/entities/User';
import type { JournalTag } from '@/db/entities/JournalTag';
import type {
  CreateJournalTagData,
  UpdateJournalTagData,
  JournalTag as JournalTagDto,
} from '@/features/journals/types';

export function serializeJournalTag(tag: JournalTag): JournalTagDto {
  return {
    id: tag.id,
    title: tag.title,
    category: tag.category as unknown as JournalTagDto['category'],
    createdAt:
      tag.createdAt instanceof Date
        ? tag.createdAt.toISOString()
        : String(tag.createdAt),
    updatedAt:
      tag.updatedAt instanceof Date
        ? tag.updatedAt.toISOString()
        : String(tag.updatedAt),
  };
}

export class JournalTagRepository extends EntityRepository<JournalTag> {
  async findAllTags(userId: number): Promise<JournalTag[]> {
    return this.find({ user: userId }, { orderBy: { createdAt: 'DESC' } });
  }

  async findByCategory(
    category: JournalCategory | string,
    userId: number,
  ): Promise<JournalTag[]> {
    const matchedCategory =
      Object.values(JournalCategory).find(
        (c) => c.toLowerCase() === category.toLowerCase(),
      ) ?? JournalCategory.LOGS;

    return this.find(
      { category: matchedCategory, user: userId },
      { orderBy: { createdAt: 'ASC' } },
    );
  }

  async findById(id: number, userId: number): Promise<JournalTag | null> {
    return this.findOne({ id, user: userId });
  }

  async createTag(
    data: CreateJournalTagData,
    userId: number,
  ): Promise<JournalTag> {
    const matchedCategory =
      Object.values(JournalCategory).find(
        (c) => c.toLowerCase() === data.category.toLowerCase(),
      ) ?? JournalCategory.LOGS;

    const tag = this.create({
      title: data.title.trim(),
      category: matchedCategory,
      user: this.em.getReference(User, userId),
    });
    await this.em.flush();
    return tag;
  }

  async updateTag(
    id: number,
    data: UpdateJournalTagData,
    userId: number,
  ): Promise<JournalTag | null> {
    const tag = await this.findOne({ id, user: userId });
    if (!tag) {
      return null;
    }

    const matchedCategory =
      data.category !== undefined
        ? Object.values(JournalCategory).find(
            (c) => c.toLowerCase() === data.category!.toLowerCase(),
          ) ?? JournalCategory.LOGS
        : undefined;

    this.assign(tag, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(matchedCategory !== undefined ? { category: matchedCategory } : {}),
    });

    await this.em.flush();
    return tag;
  }

  async deleteTag(id: number, userId: number): Promise<boolean> {
    const tag = await this.findOne({ id, user: userId });
    if (!tag) {
      return false;
    }

    this.em.remove(tag);
    await this.em.flush();
    return true;
  }
}
