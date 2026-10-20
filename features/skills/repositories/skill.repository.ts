import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '@/db/entities/User';
import { LifeArea } from '@/db/entities/LifeArea';
import type { Skill } from '@/db/entities/Skill';
import type { CreateSkillData, UpdateSkillData, Skill as SkillDto } from '@/features/skills/types';

export type { CreateSkillData, UpdateSkillData };

/**
 * Safely transforms a MikroORM Skill entity into a plain Skill DTO object.
 */
export function serializeSkill(skill: Skill): SkillDto {
  const lifeAreaDto =
    skill.lifeArea && typeof skill.lifeArea === 'object' && 'title' in skill.lifeArea
      ? {
          id: skill.lifeArea.id,
          title: skill.lifeArea.title,
          vision: skill.lifeArea.vision,
        }
      : undefined;

  return {
    id: skill.id,
    title: skill.title,
    content: skill.content,
    lifeAreaId: skill.lifeArea?.id ?? null,
    lifeArea: lifeAreaDto,
    createdAt: skill.createdAt instanceof Date ? skill.createdAt.toISOString() : String(skill.createdAt),
    updatedAt: skill.updatedAt instanceof Date ? skill.updatedAt.toISOString() : String(skill.updatedAt),
  };
}

export class SkillRepository extends EntityRepository<Skill> {
  async findAllSkills(userId?: number, lifeAreaId?: number): Promise<Skill[]> {
    const where: Record<string, unknown> = {};
    if (userId) {
      where.user = userId;
    }
    if (lifeAreaId) {
      where.lifeArea = lifeAreaId;
    }

    return this.find(where, {
      populate: ['lifeArea'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId?: number): Promise<Skill | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    return this.findOne(where, {
      populate: ['lifeArea'],
    });
  }

  async createSkill(data: CreateSkillData): Promise<Skill> {
    const user = data.userId ? this.em.getReference(User, data.userId) : undefined;
    const lifeArea = data.lifeAreaId
      ? this.em.getReference(LifeArea, data.lifeAreaId)
      : undefined;

    const skill = this.create({
      title: data.title.trim(),
      content: data.content || '',
      lifeArea,
      user,
    });

    await this.em.flush();
    return skill;
  }

  async updateSkill(
    id: number,
    data: UpdateSkillData,
    userId?: number,
  ): Promise<Skill | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const skill = await this.findOne(where, {
      populate: ['lifeArea'],
    });

    if (!skill) {
      return null;
    }

    const lifeArea =
      data.lifeAreaId !== undefined
        ? data.lifeAreaId
          ? this.em.getReference(LifeArea, data.lifeAreaId)
          : undefined
        : skill.lifeArea;

    this.assign(skill, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.lifeAreaId !== undefined ? { lifeArea } : {}),
    });

    await this.em.flush();
    return skill;
  }

  async deleteSkill(id: number, userId?: number): Promise<boolean> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const skill = await this.findOne(where);
    if (!skill) {
      return false;
    }

    this.em.remove(skill);
    await this.em.flush();
    return true;
  }
}
