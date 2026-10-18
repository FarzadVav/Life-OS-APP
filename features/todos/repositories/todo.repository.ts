import { EntityRepository } from '@mikro-orm/sqlite';
import { TodoType } from '@/db/entities/enums';
import { User } from '@/db/entities/User';
import type { Todo } from '@/db/entities/Todo';

export interface CreateTodoData {
  title: string;
  type: TodoType;
  deadline: string;
  difficulty?: number;
  userId?: number;
}

export interface UpdateTodoData {
  title?: string;
  type?: TodoType;
  deadline?: string;
  isDone?: boolean;
  difficulty?: number;
}

export class TodoRepository extends EntityRepository<Todo> {
  async findDaily(userId?: number): Promise<Todo[]> {
    const where: Record<string, unknown> = { type: TodoType.DAILY };
    if (userId) {
      where.user = userId;
    }
    return this.find(where, { orderBy: { deadline: 'ASC' } });
  }

  async findUpcoming(userId?: number): Promise<Todo[]> {
    const where: Record<string, unknown> = { type: TodoType.UPCOMING };
    if (userId) {
      where.user = userId;
    }
    return this.find(where, { orderBy: { deadline: 'ASC' } });
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
      populate: options?.populateRelations ? ['actions', 'disciplines.history'] : [],
      orderBy: { deadline: 'ASC' },
    });
  }

  async findMissionById(id: number): Promise<Todo | null> {
    return this.findOne(
      { id, type: TodoType.MISSION },
      { populate: ['actions', 'disciplines.history'] },
    );
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    const user = data.userId ? this.em.getReference(User, data.userId) : undefined;
    const todo = this.create({
      title: data.title.trim(),
      type: data.type,
      deadline: data.deadline.trim(),
      difficulty: data.difficulty,
      isDone: false,
      user,
    });
    await this.em.flush();
    return todo;
  }

  async updateTodo(id: number, data: UpdateTodoData): Promise<Todo | null> {
    const todo = await this.findOne({ id });
    if (!todo) {
      return null;
    }

    this.assign(todo, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.deadline !== undefined ? { deadline: data.deadline.trim() } : {}),
      ...(data.isDone !== undefined ? { isDone: data.isDone } : {}),
      ...(data.difficulty !== undefined ? { difficulty: data.difficulty } : {}),
    });

    await this.em.flush();
    return todo;
  }

  async toggleDone(id: number): Promise<Todo | null> {
    const todo = await this.findOne({ id });
    if (!todo) {
      return null;
    }

    todo.isDone = !todo.isDone;
    await this.em.flush();
    return todo;
  }

  async deleteTodo(id: number): Promise<boolean> {
    const todo = await this.findOne({ id });
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
