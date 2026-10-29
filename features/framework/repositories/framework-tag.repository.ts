import { EntityRepository } from '@mikro-orm/postgresql';
import type { FilterQuery } from '@mikro-orm/core';
import { User } from '@/db/entities/User';
import { LifeArea } from '@/db/entities/LifeArea';
import { assertOwnedLifeAreas } from '@/features/general/lib/orm-scope';
import type { HabitTag } from '@/db/entities/HabitTag';
import type {
  CreateFrameworkTagData,
  UpdateFrameworkTagData,
  FrameworkTag as FrameworkTagDto,
} from '@/features/framework/types';

export function serializeFrameworkTag(tag: HabitTag): FrameworkTagDto {
  return {
    id: tag.id,
    title: tag.title,
    lifeAreaId: tag.lifeArea?.id ?? null,
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

export class FrameworkTagRepository extends EntityRepository<HabitTag> {
  async findAllTags(userId: number): Promise<HabitTag[]> {
    return this.find({ user: userId }, { orderBy: { createdAt: 'DESC' } });
  }

  /**
   * lifeAreaId null returns the tags of frameworks that have no life area.
   */
  async findByLifeArea(
    lifeAreaId: number | null,
    userId: number,
  ): Promise<HabitTag[]> {
    const where: FilterQuery<HabitTag> = {
      user: userId,
      lifeArea: lifeAreaId,
    };

    return this.find(where, { orderBy: { createdAt: 'ASC' } });
  }

  async findById(id: number, userId: number): Promise<HabitTag | null> {
    return this.findOne({ id, user: userId });
  }

  async createTag(
    data: CreateFrameworkTagData,
    userId: number,
  ): Promise<HabitTag> {
    await assertOwnedLifeAreas(this.em, userId, [data.lifeAreaId]);

    const tag = this.create({
      title: data.title.trim(),
      lifeArea: data.lifeAreaId
        ? this.em.getReference(LifeArea, data.lifeAreaId)
        : undefined,
      user: this.em.getReference(User, userId),
    });
    await this.em.flush();
    return tag;
  }

  async updateTag(
    id: number,
    data: UpdateFrameworkTagData,
    userId: number,
  ): Promise<HabitTag | null> {
    const tag = await this.findOne({ id, user: userId });
    if (!tag) {
      return null;
    }

    if (data.lifeAreaId !== undefined) {
      await assertOwnedLifeAreas(this.em, userId, [data.lifeAreaId], {
        keepInactiveId: tag.lifeArea?.id ?? null,
      });
    }

    const lifeArea =
      data.lifeAreaId !== undefined
        ? data.lifeAreaId
          ? this.em.getReference(LifeArea, data.lifeAreaId)
          : undefined
        : tag.lifeArea;

    this.assign(tag, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.lifeAreaId !== undefined ? { lifeArea } : {}),
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
