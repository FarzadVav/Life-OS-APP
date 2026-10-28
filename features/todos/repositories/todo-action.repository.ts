import { EntityRepository } from '@mikro-orm/postgresql';
import { Todo } from '@/db/entities/Todo';
import type { TodoAction } from '@/db/entities/TodoAction';

import type { CreateActionData, UpdateActionData } from '@/features/todos/types';

export type { CreateActionData, UpdateActionData };

/**
 * TodoAction has no `user` column of its own, so ownership is enforced through
 * the owning mission: `{ mission: { user: userId } }` compiles to an inner join
 * on todos. Every method requires userId for that reason.
 */
export class TodoActionRepository extends EntityRepository<TodoAction> {
  async findByMission(missionId: number, userId: number): Promise<TodoAction[]> {
    return this.find({ mission: { id: missionId, user: userId } }, { orderBy: { deadline: 'ASC' } });
  }

  /** Returns null when the mission does not belong to userId. */
  async createAction(
    missionId: number,
    data: CreateActionData,
    userId: number,
  ): Promise<TodoAction | null> {
    const mission = await this.em.findOne(Todo, { id: missionId, user: userId });
    if (!mission) {
      return null;
    }

    const action = this.create({
      title: data.title.trim(),
      deadline: data.deadline ? data.deadline.trim() : null,
      isDone: data.isDone ?? false,
      mission,
    });
    await this.em.flush();
    return action;
  }

  async toggleAction(id: number, userId: number): Promise<TodoAction | null> {
    const action = await this.findOne({ id, mission: { user: userId } });
    if (!action) {
      return null;
    }

    action.isDone = !action.isDone;
    await this.em.flush();
    return action;
  }

  async updateAction(id: number, data: UpdateActionData, userId: number): Promise<TodoAction | null> {
    const action = await this.findOne({ id, mission: { user: userId } });
    if (!action) {
      return null;
    }

    this.assign(action, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.deadline !== undefined
        ? { deadline: data.deadline ? data.deadline.trim() : null }
        : {}),
      ...(data.isDone !== undefined ? { isDone: data.isDone } : {}),
    });

    await this.em.flush();
    return action;
  }

  async deleteAction(id: number, userId: number): Promise<boolean> {
    const action = await this.findOne({ id, mission: { user: userId } });
    if (!action) {
      return false;
    }

    this.em.remove(action);
    await this.em.flush();
    return true;
  }
}
