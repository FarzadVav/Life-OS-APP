import { EntityRepository } from '@mikro-orm/postgresql';
import { FrameworkCategory, FrameworkSection } from '@/db/entities/enums';
import { User } from '@/db/entities/User';
import type { FrameworkItem } from '@/db/entities/FrameworkItem';

import type {
  CreateFrameworkItemData,
  UpdateFrameworkItemData,
  FrameworkItem as FrameworkItemDto,
} from '@/features/framework/types';

export type { CreateFrameworkItemData, UpdateFrameworkItemData };

/**
 * Safely transforms a MikroORM FrameworkItem entity into a plain FrameworkItem DTO object.
 */
export function serializeFrameworkItem(item: FrameworkItem): FrameworkItemDto {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    category: item.category as unknown as FrameworkItemDto['category'],
    section: item.section as unknown as FrameworkItemDto['section'],
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
  };
}

export class FrameworkRepository extends EntityRepository<FrameworkItem> {
  async findAllItems(userId?: number): Promise<FrameworkItem[]> {
    const where: Record<string, unknown> = {};
    if (userId) {
      where.user = userId;
    }
    return this.find(where, { orderBy: { createdAt: 'DESC' } });
  }

  async findByCategoryAndSection(
    category?: FrameworkCategory | string,
    section?: FrameworkSection | string,
    userId?: number,
  ): Promise<FrameworkItem[]> {
    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      const matchedCategory = Object.values(FrameworkCategory).find(
        (c) => c.toLowerCase() === category.toLowerCase(),
      );
      if (matchedCategory) {
        where.category = matchedCategory;
      }
    }

    if (section && section !== 'all') {
      const matchedSection = Object.values(FrameworkSection).find(
        (s) => s.toLowerCase() === section.toLowerCase(),
      );
      if (matchedSection) {
        where.section = matchedSection;
      }
    }

    if (userId) {
      where.user = userId;
    }

    return this.find(where, { orderBy: { createdAt: 'DESC' } });
  }

  async findById(id: number, userId?: number): Promise<FrameworkItem | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    return this.findOne(where);
  }

  async createItem(data: CreateFrameworkItemData): Promise<FrameworkItem> {
    const user = data.userId ? this.em.getReference(User, data.userId) : undefined;
    const item = this.create({
      title: data.title.trim(),
      content: data.content,
      category: data.category as unknown as FrameworkCategory,
      section: data.section as unknown as FrameworkSection,
      user,
    });
    await this.em.flush();
    return item;
  }

  async updateItem(id: number, data: UpdateFrameworkItemData, userId?: number): Promise<FrameworkItem | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const item = await this.findOne(where);
    if (!item) {
      return null;
    }

    this.assign(item, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.category !== undefined ? { category: data.category as unknown as FrameworkCategory } : {}),
      ...(data.section !== undefined ? { section: data.section as unknown as FrameworkSection } : {}),
    });

    await this.em.flush();
    return item;
  }

  async deleteItem(id: number, userId?: number): Promise<boolean> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const item = await this.findOne(where);
    if (!item) {
      return false;
    }

    this.em.remove(item);
    await this.em.flush();
    return true;
  }

  async getCountsByCategory(userId?: number): Promise<Record<FrameworkCategory, number>> {
    const baseWhere = userId ? { user: userId } : {};

    const categories = Object.values(FrameworkCategory);
    const counts = await Promise.all(
      categories.map((cat) => this.count({ ...baseWhere, category: cat })),
    );

    const result = {} as Record<FrameworkCategory, number>;
    categories.forEach((cat, idx) => {
      result[cat] = counts[idx];
    });

    return result;
  }

  async getCountsBySection(userId?: number): Promise<{
    visions: number;
    rules: number;
    concepts: number;
  }> {
    const baseWhere = userId ? { user: userId } : {};

    const [visions, rules, concepts] = await Promise.all([
      this.count({ ...baseWhere, section: FrameworkSection.VISIONS }),
      this.count({ ...baseWhere, section: FrameworkSection.RULES }),
      this.count({ ...baseWhere, section: FrameworkSection.CONCEPTS }),
    ]);

    return {
      visions,
      rules,
      concepts,
    };
  }
}
