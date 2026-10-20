import { Cascade, Collection, OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { Todo } from './Todo';
import { DisciplineHistory } from './DisciplineHistory';
import { LifeArea } from './LifeArea';

@Entity({ tableName: 'todo_disciplines' })
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
  mission!: Rel<Todo>;

  @ManyToOne(() => LifeArea, { nullable: true, deleteRule: 'set null' })
  lifeArea?: Rel<LifeArea>;

  @OneToMany(() => DisciplineHistory, (history) => history.discipline, { cascade: [Cascade.ALL], orphanRemoval: true })
  history = new Collection<DisciplineHistory>(this);
}
