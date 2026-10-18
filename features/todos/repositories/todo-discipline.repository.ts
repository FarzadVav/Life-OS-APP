import { EntityRepository } from '@mikro-orm/sqlite';
import { Todo } from '@/db/entities/Todo';
import { DisciplineHistory } from '@/db/entities/DisciplineHistory';
import type { TodoDiscipline } from '@/db/entities/TodoDiscipline';

import type { CreateDisciplineData } from '@/features/todos/types';

export type { CreateDisciplineData };

export class TodoDisciplineRepository extends EntityRepository<TodoDiscipline> {
  async findByMission(missionId: number): Promise<TodoDiscipline[]> {
    return this.find({ mission: missionId }, { populate: ['history'], orderBy: { id: 'ASC' } });
  }

  async createDiscipline(missionId: number, data: CreateDisciplineData): Promise<TodoDiscipline> {
    const mission = this.em.getReference(Todo, missionId);
    const discipline = this.create({
      title: data.title.trim(),
      repeatInterval: data.repeatInterval.trim(),
      mission,
    });
    await this.em.flush();
    return discipline;
  }

  async recordHistory(
    disciplineId: number,
    date: string,
    isDone = true,
  ): Promise<DisciplineHistory> {
    const discipline = await this.findOneOrFail({ id: disciplineId });
    const history = this.em.create(DisciplineHistory, {
      date,
      isDone,
      discipline,
    });
    await this.em.flush();
    return history;
  }

  async deleteDiscipline(id: number): Promise<boolean> {
    const discipline = await this.findOne({ id });
    if (!discipline) {
      return false;
    }

    this.em.remove(discipline);
    await this.em.flush();
    return true;
  }
}
