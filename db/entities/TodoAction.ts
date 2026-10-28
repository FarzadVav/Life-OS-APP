import { OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { Todo } from './Todo';

@Entity({ tableName: 'todo_actions' })
export class TodoAction extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isDone' | 'deadline';

  @Property({ type: 'string' })
  title!: string;

  /**
   * Deadline date string in "YYYY-MM-DD" format
   */
  @Property({ type: 'string', nullable: true })
  deadline?: string | null;

  @Property({ type: 'boolean', default: false })
  isDone: boolean = false;

  @ManyToOne(() => Todo, { nullable: false, deleteRule: 'cascade' })
  mission!: Rel<Todo>;
}
