import { EntityRepository } from '@mikro-orm/postgresql';
import type { FilterQuery } from '@mikro-orm/core';
import { User } from '@/db/entities/User';
import { LifeArea } from '@/db/entities/LifeArea';
import { Habit } from '@/db/entities/Habit';
import { HabitHistory } from '@/db/entities/HabitHistory';
import { assertOwnedLifeAreas } from '@/features/general/lib/orm-scope';

import type {
  CreateHabitData,
  UpdateHabitData,
  Habit as HabitDto,
} from '../types';

export function serializeHabit(habit: Habit): HabitDto {
  const historyList = habit.history?.isInitialized?.()
    ? habit.history.getItems().map((h) => ({
        id: h.id,
        date: h.date,
        isDone: h.isDone,
      }))
    : [];

  return {
    id: habit.id,
    title: habit.title,
    description: habit.description || '',
    repeatInterval: habit.repeatInterval || 'Every 1 Day',
    lifeAreaId: habit.lifeArea?.id ?? null,
    lifeArea: habit.lifeArea
      ? {
          id: habit.lifeArea.id,
          title: habit.lifeArea.title,
        }
      : undefined,
    history: historyList,
    createdAt:
      habit.createdAt instanceof Date
        ? habit.createdAt.toISOString()
        : String(habit.createdAt),
    updatedAt:
      habit.updatedAt instanceof Date
        ? habit.updatedAt.toISOString()
        : String(habit.updatedAt),
  };
}

export class HabitRepository extends EntityRepository<Habit> {
  async findAllHabits(
    userId: number,
    options?: { lifeAreaId?: number | null },
  ): Promise<Habit[]> {
    const where: FilterQuery<Habit> = { user: userId };
    if (options?.lifeAreaId !== undefined) {
      where.lifeArea = options.lifeAreaId;
    }

    return this.find(where, {
      populate: ['lifeArea', 'history'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId: number): Promise<Habit | null> {
    return this.findOne({ id, user: userId }, { populate: ['lifeArea', 'history'] });
  }

  async createHabit(data: CreateHabitData, userId: number): Promise<Habit> {
    await assertOwnedLifeAreas(this.em, userId, [data.lifeAreaId]);

    const habit = this.create({
      title: data.title.trim(),
      description: data.description?.trim() || '',
      repeatInterval: data.repeatInterval?.trim() || 'Every 1 Day',
      lifeArea:
        data.lifeAreaId && data.lifeAreaId > 0
          ? this.em.getReference(LifeArea, data.lifeAreaId)
          : undefined,
      user: this.em.getReference(User, userId),
    });

    await this.em.flush();
    await this.em.populate(habit, ['lifeArea', 'history']);
    return habit;
  }

  async updateHabit(
    id: number,
    data: UpdateHabitData,
    userId: number,
  ): Promise<Habit | null> {
    const habit = await this.findOne({ id, user: userId }, { populate: ['lifeArea', 'history'] });
    if (!habit) {
      return null;
    }

    if (data.lifeAreaId !== undefined) {
      await assertOwnedLifeAreas(this.em, userId, [data.lifeAreaId]);
    }

    if (data.title !== undefined) {
      habit.title = data.title.trim();
    }
    if (data.description !== undefined) {
      habit.description = data.description.trim();
    }
    if (data.repeatInterval !== undefined) {
      habit.repeatInterval = data.repeatInterval.trim() || 'Every 1 Day';
    }
    if (data.lifeAreaId !== undefined) {
      habit.lifeArea =
        data.lifeAreaId && data.lifeAreaId > 0
          ? this.em.getReference(LifeArea, data.lifeAreaId)
          : undefined;
    }

    await this.em.flush();
    return habit;
  }

  async deleteHabit(id: number, userId: number): Promise<boolean> {
    const habit = await this.findOne({ id, user: userId });
    if (!habit) {
      return false;
    }

    this.em.remove(habit);
    await this.em.flush();
    return true;
  }

  /**
   * Returns null when the habit is missing or not owned by userId, so callers
   * treat "not yours" the same as "not found".
   */
  async recordHistory(
    habitId: number,
    date: string,
    isDone: boolean,
    userId: number,
  ): Promise<HabitHistory | null> {
    const habit = await this.findOne({ id: habitId, user: userId });
    if (!habit) {
      return null;
    }

    // Check if a record already exists for this date to avoid duplicate entries
    const existing = await this.em.findOne(HabitHistory, {
      habit: habit.id,
      date,
    });

    if (existing) {
      existing.isDone = isDone;
      await this.em.flush();
      return existing;
    }

    const history = this.em.create(HabitHistory, {
      date,
      isDone,
      habit,
    });

    await this.em.flush();
    return history;
  }
}
