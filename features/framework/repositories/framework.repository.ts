import { EntityRepository } from '@mikro-orm/sqlite';
import { FrameworkCategory, FrameworkSection } from '@/db/entities/enums';
import { User } from '@/db/entities/User';
import type { FrameworkItem } from '@/db/entities/FrameworkItem';

export interface CreateFrameworkItemData {
  title: string;
  content: string;
  category: FrameworkCategory;
  section: FrameworkSection;
  userId?: number;
}

export interface UpdateFrameworkItemData {
  title?: string;
  content?: string;
  category?: FrameworkCategory;
  section?: FrameworkSection;
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
    category: FrameworkCategory,
    section?: FrameworkSection,
    userId?: number,
  ): Promise<FrameworkItem[]> {
    const where: Record<string, unknown> = { category };
    if (section) {
      where.section = section;
    }
    if (userId) {
      where.user = userId;
    }

    return this.find(where, { orderBy: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<FrameworkItem | null> {
    return this.findOne({ id });
  }

  async createItem(data: CreateFrameworkItemData): Promise<FrameworkItem> {
    const user = data.userId ? this.em.getReference(User, data.userId) : undefined;
    const item = this.create({
      title: data.title.trim(),
      content: data.content,
      category: data.category,
      section: data.section,
      user,
    });
    await this.em.flush();
    return item;
  }

  async updateItem(id: number, data: UpdateFrameworkItemData): Promise<FrameworkItem | null> {
    const item = await this.findOne({ id });
    if (!item) {
      return null;
    }

    this.assign(item, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.section !== undefined ? { section: data.section } : {}),
    });

    await this.em.flush();
    return item;
  }

  async deleteItem(id: number): Promise<boolean> {
    const item = await this.findOne({ id });
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
