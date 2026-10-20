import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '@/db/entities/User';
import { LifeArea } from '@/db/entities/LifeArea';
import { Habit } from '@/db/entities/Habit';
import { HabitHistory } from '@/db/entities/HabitHistory';

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
    userId?: number,
    options?: { lifeAreaId?: number | null },
  ): Promise<Habit[]> {
    const where: Record<string, unknown> = {};
    if (userId) {
      where.user = userId;
    }
    if (options?.lifeAreaId !== undefined) {
      if (options.lifeAreaId === null) {
        where.lifeArea = null;
      } else {
        where.lifeArea = options.lifeAreaId;
      }
    }

    return this.find(where, {
      populate: ['lifeArea', 'history'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId?: number): Promise<Habit | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    return this.findOne(where, { populate: ['lifeArea', 'history'] });
  }

  async createHabit(data: CreateHabitData): Promise<Habit> {
    const user = data.userId ? this.em.getReference(User, data.userId) : undefined;
    const lifeArea =
      data.lifeAreaId && data.lifeAreaId > 0
        ? this.em.getReference(LifeArea, data.lifeAreaId)
        : undefined;

    const habit = this.create({
      title: data.title.trim(),
      description: data.description?.trim() || '',
      repeatInterval: data.repeatInterval?.trim() || 'Every 1 Day',
      lifeArea,
      user,
    });

    await this.em.flush();
    await this.em.populate(habit, ['lifeArea', 'history']);
    return habit;
  }

  async updateHabit(
    id: number,
    data: UpdateHabitData,
    userId?: number,
  ): Promise<Habit | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const habit = await this.findOne(where, { populate: ['lifeArea', 'history'] });
    if (!habit) {
      return null;
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

  async deleteHabit(id: number, userId?: number): Promise<boolean> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const habit = await this.findOne(where);
    if (!habit) {
      return false;
    }

    this.em.remove(habit);
    await this.em.flush();
    return true;
  }

  async recordHistory(
    habitId: number,
    date: string,
    isDone = true,
  ): Promise<HabitHistory> {
    const habit = await this.findOneOrFail({ id: habitId });

    // Check if a record already exists for this date to avoid duplicate entries
    const existing = await this.em.findOne(HabitHistory, {
      habit: habitId,
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
