import { Cascade, Collection, OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { Todo } from './Todo';
import { TodoDiscipline } from './TodoDiscipline';
import { Skill } from './Skill';
import { Habit } from './Habit';

@Entity({ tableName: 'life_areas' })
export class LifeArea extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'string' })
  title!: string;

  /**
   * TipTap rich text HTML for long-term vision & principles
   */
  @Property({ type: 'text' })
  vision!: string;

  @ManyToOne(() => User, { nullable: true, deleteRule: 'cascade' })
  user?: Rel<User>;

  @OneToMany(() => Todo, (todo) => todo.lifeArea, { cascade: [Cascade.PERSIST], orphanRemoval: false })
  todos = new Collection<Todo>(this);

  @OneToMany(() => TodoDiscipline, (discipline) => discipline.lifeArea, { cascade: [Cascade.PERSIST], orphanRemoval: false })
  disciplines = new Collection<TodoDiscipline>(this);

  @OneToMany(() => Skill, (skill) => skill.lifeArea, { cascade: [Cascade.PERSIST], orphanRemoval: false })
  skills = new Collection<Skill>(this);

  @OneToMany(() => Habit, (habit) => habit.lifeArea, { cascade: [Cascade.PERSIST], orphanRemoval: false })
  habits = new Collection<Habit>(this);
}
