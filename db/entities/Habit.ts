import { Cascade, Collection, OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { LifeArea } from './LifeArea';
import { HabitHistory } from './HabitHistory';

@Entity({ tableName: 'habits' })
export class Habit extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'text', default: '' })
  description: string = '';

  /**
   * Recurrence interval string, e.g. "Every 1 Day", "Every 2 Days", "Every 1 Week"
   * Implemented consistently with mission > discipline repeat-interval.
   */
  @Property({ type: 'string', default: 'Every 1 Day' })
  repeatInterval: string = 'Every 1 Day';

  @ManyToOne(() => LifeArea, { nullable: true, deleteRule: 'set null' })
  lifeArea?: Rel<LifeArea>;

  @ManyToOne(() => User, { nullable: true, deleteRule: 'cascade' })
  user?: Rel<User>;

  @OneToMany(() => HabitHistory, (history) => history.habit, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  history = new Collection<HabitHistory>(this);
}
