import { Cascade, Collection, OptionalProps } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { Todo } from './Todo';
import { DisciplineHistory } from './DisciplineHistory';
import { TodoDisciplineRepository } from '@/features/todos/repositories/todo-discipline.repository';

@Entity({ tableName: 'todo_disciplines', repository: () => TodoDisciplineRepository })
export class TodoDiscipline extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'string' })
  title!: string;

  /**
   * Recurrence interval string, e.g. "Every 1 Day", "Every 2 Days", "Every 1 Week"
   */
  @Property({ type: 'string' })
  repeatInterval!: string;

  @ManyToOne(() => Todo, { nullable: false, deleteRule: 'cascade' })
  mission!: Todo;

  @OneToMany(() => DisciplineHistory, (history) => history.discipline, { cascade: [Cascade.ALL], orphanRemoval: true })
  history = new Collection<DisciplineHistory>(this);
}
