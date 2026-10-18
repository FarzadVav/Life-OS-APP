import { EntityRepository } from '@mikro-orm/postgresql';
import { Todo } from '@/db/entities/Todo';
import type { TodoAction } from '@/db/entities/TodoAction';

import type { CreateActionData, UpdateActionData } from '@/features/todos/types';

export type { CreateActionData, UpdateActionData };

export class TodoActionRepository extends EntityRepository<TodoAction> {
  async findByMission(missionId: number): Promise<TodoAction[]> {
    return this.find({ mission: missionId }, { orderBy: { deadline: 'ASC' } });
  }

  async createAction(missionId: number, data: CreateActionData): Promise<TodoAction> {
    const mission = this.em.getReference(Todo, missionId);
    const action = this.create({
      title: data.title.trim(),
      deadline: data.deadline.trim(),
      isDone: data.isDone ?? false,
      mission,
    });
    await this.em.flush();
    return action;
  }

  async toggleAction(id: number): Promise<TodoAction | null> {
    const action = await this.findOne({ id });
    if (!action) {
      return null;
    }

    action.isDone = !action.isDone;
    await this.em.flush();
    return action;
  }

  async updateAction(id: number, data: UpdateActionData): Promise<TodoAction | null> {
    const action = await this.findOne({ id });
    if (!action) {
      return null;
    }

    this.assign(action, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.deadline !== undefined ? { deadline: data.deadline.trim() } : {}),
      ...(data.isDone !== undefined ? { isDone: data.isDone } : {}),
    });

    await this.em.flush();
    return action;
  }

  async deleteAction(id: number): Promise<boolean> {
    const action = await this.findOne({ id });
    if (!action) {
      return false;
    }

    this.em.remove(action);
    await this.em.flush();
    return true;
  }
}
