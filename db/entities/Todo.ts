import { Cascade, Collection, OptionalProps } from '@mikro-orm/core';
import { Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { TodoAction } from './TodoAction';
import { TodoDiscipline } from './TodoDiscipline';
import { TodoRepository } from '@/features/todos/repositories/todo.repository';

export enum TodoType {
  DAILY = 'Daily',
  UPCOMING = 'Upcoming',
  MISSION = 'Mission',
}

@Entity({ tableName: 'todos', repository: () => TodoRepository })
export class Todo extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isDone' | 'type';

  @Property({ type: 'string' })
  title!: string;

  @Enum({ items: () => TodoType, default: TodoType.DAILY })
  type: TodoType = TodoType.DAILY;

  /**
   * For Daily: "HH:mm" (e.g. "10:30")
   * For Upcoming/Mission: "YYYY-MM-DD" (e.g. "2026-10-30")
   */
  @Property({ type: 'string' })
  deadline!: string;

  @Property({ type: 'boolean', default: false })
  isDone: boolean = false;

  /**
   * Time and Energy Cost rating (1-5), used predominantly by Missions
   */
  @Property({ type: 'integer', nullable: true })
  difficulty?: number;

  @ManyToOne(() => User, { nullable: true, deleteRule: 'cascade' })
  user?: User;

  @OneToMany(() => TodoAction, (action) => action.mission, { cascade: [Cascade.ALL], orphanRemoval: true })
  actions = new Collection<TodoAction>(this);

  @OneToMany(() => TodoDiscipline, (discipline) => discipline.mission, { cascade: [Cascade.ALL], orphanRemoval: true })
  disciplines = new Collection<TodoDiscipline>(this);
}
