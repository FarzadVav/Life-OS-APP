import { EntityRepository } from '@mikro-orm/postgresql';
import { Todo } from '@/db/entities/Todo';
import { DisciplineHistory } from '@/db/entities/DisciplineHistory';
import type { TodoDiscipline } from '@/db/entities/TodoDiscipline';

import type { CreateDisciplineData } from '@/features/todos/types';

export type { CreateDisciplineData };

/**
 * Ownership is enforced through the mission (`{ mission: { user: userId } }`),
 * since todo_disciplines carries no user column.
 */
export class TodoDisciplineRepository extends EntityRepository<TodoDiscipline> {
  async findByMission(missionId: number, userId: number): Promise<TodoDiscipline[]> {
    return this.find(
      { mission: { id: missionId, user: userId } },
      { populate: ['history'], orderBy: { id: 'ASC' } },
    );
  }

  /** Returns null when the mission does not belong to userId. */
  async createDiscipline(
    missionId: number,
    data: CreateDisciplineData,
    userId: number,
  ): Promise<TodoDiscipline | null> {
    const mission = await this.em.findOne(Todo, { id: missionId, user: userId });
    if (!mission) {
      return null;
    }

    const discipline = this.create({
      title: data.title.trim(),
      mission,
    });
    await this.em.flush();
    return discipline;
  }

  /** Returns null when the discipline is missing or not owned by userId. */
  async recordHistory(
    disciplineId: number,
    date: string,
    isDone: boolean,
    userId: number,
  ): Promise<DisciplineHistory | null> {
    const discipline = await this.findOne({ id: disciplineId, mission: { user: userId } });
    if (!discipline) {
      return null;
    }

    const dayPrefix = date.slice(0, 10);
    const existing = await this.em.findOne(DisciplineHistory, {
      discipline: discipline.id,
      date: { $like: `${dayPrefix}%` },
    });

    if (existing) {
      existing.isDone = isDone;
      existing.date = date;
      await this.em.flush();
      return existing;
    }

    const history = this.em.create(DisciplineHistory, {
      date,
      isDone,
      discipline,
    });
    await this.em.flush();
    return history;
  }

  async deleteDiscipline(id: number, userId: number): Promise<boolean> {
    const discipline = await this.findOne({ id, mission: { user: userId } });
    if (!discipline) {
      return false;
    }

    this.em.remove(discipline);
    await this.em.flush();
    return true;
  }
}
