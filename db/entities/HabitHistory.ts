import { OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { Habit } from './Habit';

@Entity({ tableName: 'habit_history' })
export class HabitHistory extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isDone';

  /**
   * Date identifier, e.g. "2026-10-20"
   */
  @Property({ type: 'string' })
  date!: string;

  @Property({ type: 'boolean', default: true })
  isDone: boolean = true;

  @ManyToOne(() => Habit, { nullable: false, deleteRule: 'cascade' })
  habit!: Rel<Habit>;
}
