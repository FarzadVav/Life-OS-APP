import { EntityRepository } from '@mikro-orm/postgresql';
import { TodoType } from '@/db/entities/enums';
import { User } from '@/db/entities/User';
import { TodoAction } from '@/db/entities/TodoAction';
import { TodoDiscipline } from '@/db/entities/TodoDiscipline';
import { LifeArea } from '@/db/entities/LifeArea';
import type { Todo } from '@/db/entities/Todo';

import type { CreateTodoData, UpdateTodoData, Todo as TodoDto } from '@/features/todos/types';

export type { CreateTodoData, UpdateTodoData };

/**
 * Safely transforms a MikroORM Todo entity and its initialized collections
 * into a plain Todo DTO object matching the ArkType Todo schema.
 */
export function serializeTodo(todo: Todo): TodoDto {
  const lifeAreaDto =
    todo.lifeArea && typeof todo.lifeArea === 'object' && 'title' in todo.lifeArea
      ? {
          id: todo.lifeArea.id,
          title: todo.lifeArea.title,
          vision: todo.lifeArea.vision,
        }
      : undefined;

  return {
    id: todo.id,
    title: todo.title,
    type: todo.type as unknown as TodoDto['type'],
    deadline: todo.deadline,
    isDone: todo.isDone,
    difficulty: todo.difficulty,
    lifeAreaId: todo.lifeArea?.id ?? null,
    lifeArea: lifeAreaDto,
    actions: todo.actions?.isInitialized()
      ? todo.actions.getItems().map((a) => ({
          id: a.id,
          title: a.title,
          deadline: a.deadline,
          isDone: a.isDone,
        }))
      : undefined,
    disciplines: todo.disciplines?.isInitialized()
      ? todo.disciplines.getItems().map((d) => {
          const discLifeAreaDto =
            d.lifeArea && typeof d.lifeArea === 'object' && 'title' in d.lifeArea
              ? {
                  id: d.lifeArea.id,
                  title: d.lifeArea.title,
                  vision: d.lifeArea.vision,
                }
              : undefined;

          return {
            id: d.id,
            title: d.title,
            repeatInterval: d.repeatInterval,
            lifeAreaId: d.lifeArea?.id ?? null,
            lifeArea: discLifeAreaDto,
            history: d.history?.isInitialized()
              ? d.history.getItems().map((h) => ({
                  date: h.date,
                  isDone: h.isDone,
                }))
              : undefined,
          };
        })
      : undefined,
  };
}

export class TodoRepository extends EntityRepository<Todo> {
  async findDaily(userId?: number): Promise<Todo[]> {
    const where: Record<string, unknown> = { type: TodoType.DAILY };
    if (userId) {
      where.user = userId;
    }
    return this.find(where, {
      populate: ['lifeArea'],
      orderBy: { deadline: 'ASC' },
    });
  }

  async findUpcoming(userId?: number): Promise<Todo[]> {
    const where: Record<string, unknown> = { type: TodoType.UPCOMING };
    if (userId) {
      where.user = userId;
    }
    return this.find(where, {
      populate: ['lifeArea'],
      orderBy: { deadline: 'ASC' },
    });
  }

  async findMissions(
    userId?: number,
    options?: { populateRelations?: boolean },
  ): Promise<Todo[]> {
    const where: Record<string, unknown> = { type: TodoType.MISSION };
    if (userId) {
      where.user = userId;
    }
    return this.find(where, {
      populate: options?.populateRelations
        ? ['actions', 'disciplines.history', 'disciplines.lifeArea', 'lifeArea']
        : ['lifeArea'],
      orderBy: { deadline: 'ASC' },
    });
  }

  async findAllTodos(
    userId?: number,
    options?: { populateRelations?: boolean },
  ): Promise<Todo[]> {
    const where: Record<string, unknown> = {};
    if (userId) {
      where.user = userId;
    }
    return this.find(where, {
      populate:
        options?.populateRelations !== false
          ? ['actions', 'disciplines.history', 'disciplines.lifeArea', 'lifeArea']
          : ['lifeArea'],
      orderBy: { deadline: 'ASC' },
    });
  }

  async findById(id: number, userId?: number): Promise<Todo | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    return this.findOne(where, {
      populate: ['actions', 'disciplines.history', 'disciplines.lifeArea', 'lifeArea'],
    });
  }

  async findMissionById(id: number, userId?: number): Promise<Todo | null> {
    const where: Record<string, unknown> = { id, type: TodoType.MISSION };
    if (userId) {
      where.user = userId;
    }
    return this.findOne(where, {
      populate: ['actions', 'disciplines.history', 'disciplines.lifeArea', 'lifeArea'],
    });
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    const user = data.userId ? this.em.getReference(User, data.userId) : undefined;
    const lifeArea = data.lifeAreaId
      ? this.em.getReference(LifeArea, data.lifeAreaId)
      : undefined;

    const todo = this.create({
      title: data.title.trim(),
      type: data.type as unknown as TodoType,
      deadline: data.deadline.trim(),
      difficulty: data.difficulty,
      isDone: data.isDone ?? false,
      user,
      lifeArea,
    });

    if (data.actions && data.actions.length > 0) {
      for (const act of data.actions) {
        todo.actions.add(
          this.em.create(TodoAction, {
            title: act.title.trim(),
            deadline: act.deadline.trim(),
            isDone: act.isDone ?? false,
            mission: todo,
          }),
        );
      }
    }

    if (data.disciplines && data.disciplines.length > 0) {
      for (const disc of data.disciplines) {
        const discLifeArea = disc.lifeAreaId
          ? this.em.getReference(LifeArea, disc.lifeAreaId)
          : lifeArea;

        todo.disciplines.add(
          this.em.create(TodoDiscipline, {
            title: disc.title.trim(),
            repeatInterval: disc.repeatInterval.trim(),
            lifeArea: discLifeArea,
            mission: todo,
          }),
        );
      }
    }

    await this.em.flush();
    return todo;
  }

  async updateTodo(id: number, data: UpdateTodoData, userId?: number): Promise<Todo | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const todo = await this.findOne(where, {
      populate: ['actions', 'disciplines.history', 'disciplines.lifeArea', 'lifeArea'],
    });

    if (!todo) {
      return null;
    }

    const lifeArea =
      data.lifeAreaId !== undefined
        ? data.lifeAreaId
          ? this.em.getReference(LifeArea, data.lifeAreaId)
          : undefined
        : todo.lifeArea;

    this.assign(todo, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.type !== undefined ? { type: data.type as unknown as TodoType } : {}),
      ...(data.deadline !== undefined ? { deadline: data.deadline.trim() } : {}),
      ...(data.isDone !== undefined ? { isDone: data.isDone } : {}),
      ...(data.difficulty !== undefined ? { difficulty: data.difficulty } : {}),
      ...(data.lifeAreaId !== undefined ? { lifeArea } : {}),
    });

    // Synchronize nested actions if provided
    if (data.actions !== undefined) {
      const existingActionMap = new Map(todo.actions.getItems().map((a) => [a.id, a]));
      const newActionIds = new Set<number>();

      for (const actData of data.actions) {
        if (actData.id && existingActionMap.has(actData.id)) {
          const existing = existingActionMap.get(actData.id)!;
          this.em.assign(existing, {
            title: actData.title.trim(),
            deadline: actData.deadline.trim(),
            ...(actData.isDone !== undefined ? { isDone: actData.isDone } : {}),
          });
          newActionIds.add(existing.id);
        } else {
          const newAct = this.em.create(TodoAction, {
            title: actData.title.trim(),
            deadline: actData.deadline.trim(),
            isDone: actData.isDone ?? false,
            mission: todo,
          });
          todo.actions.add(newAct);
        }
      }

      for (const existing of todo.actions.getItems()) {
        if (existing.id && !newActionIds.has(existing.id) && !data.actions.some((a) => a.id === existing.id)) {
          todo.actions.remove(existing);
        }
      }
    }

    // Synchronize nested disciplines if provided
    if (data.disciplines !== undefined) {
      const existingDiscMap = new Map(todo.disciplines.getItems().map((d) => [d.id, d]));
      const newDiscIds = new Set<number>();

      for (const discData of data.disciplines) {
        const itemLifeArea =
          discData.lifeAreaId !== undefined
            ? discData.lifeAreaId
              ? this.em.getReference(LifeArea, discData.lifeAreaId)
              : undefined
            : lifeArea;

        if (discData.id && existingDiscMap.has(discData.id)) {
          const existing = existingDiscMap.get(discData.id)!;
          this.em.assign(existing, {
            title: discData.title.trim(),
            repeatInterval: discData.repeatInterval.trim(),
            ...(discData.lifeAreaId !== undefined ? { lifeArea: itemLifeArea } : {}),
          });
          newDiscIds.add(existing.id);
        } else {
          const newDisc = this.em.create(TodoDiscipline, {
            title: discData.title.trim(),
            repeatInterval: discData.repeatInterval.trim(),
            lifeArea: itemLifeArea,
            mission: todo,
          });
          todo.disciplines.add(newDisc);
        }
      }

      for (const existing of todo.disciplines.getItems()) {
        if (existing.id && !newDiscIds.has(existing.id) && !data.disciplines.some((d) => d.id === existing.id)) {
          todo.disciplines.remove(existing);
        }
      }
    }

    await this.em.flush();
    return todo;
  }

  async toggleDone(id: number, userId?: number): Promise<Todo | null> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const todo = await this.findOne(where);
    if (!todo) {
      return null;
    }

    todo.isDone = !todo.isDone;
    await this.em.flush();
    return todo;
  }

  async deleteTodo(id: number, userId?: number): Promise<boolean> {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.user = userId;
    }
    const todo = await this.findOne(where);
    if (!todo) {
      return false;
    }

    this.em.remove(todo);
    await this.em.flush();
    return true;
  }

  async getTodosStats(userId?: number): Promise<{
    dailyCompleted: number;
    dailyTotal: number;
    upcomingTotal: number;
    missionsTotal: number;
  }> {
    const baseWhere = userId ? { user: userId } : {};

    const [dailyCompleted, dailyTotal, upcomingTotal, missionsTotal] = await Promise.all([
      this.count({ ...baseWhere, type: TodoType.DAILY, isDone: true }),
      this.count({ ...baseWhere, type: TodoType.DAILY }),
      this.count({ ...baseWhere, type: TodoType.UPCOMING }),
      this.count({ ...baseWhere, type: TodoType.MISSION }),
    ]);

    return {
      dailyCompleted,
      dailyTotal,
      upcomingTotal,
      missionsTotal,
    };
  }
}
