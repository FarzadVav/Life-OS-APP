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
