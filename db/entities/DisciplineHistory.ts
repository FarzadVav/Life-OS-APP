import { OptionalProps } from '@mikro-orm/core';
import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { TodoDiscipline } from './TodoDiscipline';

@Entity({ tableName: 'discipline_history' })
export class DisciplineHistory extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isDone';

  /**
   * ISO 8601 string or date identifier, e.g. "2026-10-16T10:00:00Z" or "2026-10-16"
   */
  @Property({ type: 'string' })
  date!: string;

  @Property({ type: 'boolean', default: true })
  isDone: boolean = true;

  @ManyToOne(() => TodoDiscipline, { nullable: false, deleteRule: 'cascade' })
  discipline!: TodoDiscipline;
}
