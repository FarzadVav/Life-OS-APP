import { Cascade, Collection, OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { Todo } from './Todo';
import { DisciplineHistory } from './DisciplineHistory';

@Entity({ tableName: 'todo_disciplines' })
export class TodoDiscipline extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'string' })
  title!: string;

  @ManyToOne(() => Todo, { nullable: false, deleteRule: 'cascade' })
  mission!: Rel<Todo>;

  @OneToMany(() => DisciplineHistory, (history) => history.discipline, { cascade: [Cascade.ALL], orphanRemoval: true })
  history = new Collection<DisciplineHistory>(this);
}
