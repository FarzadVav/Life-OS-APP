import { OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { LifeArea } from './LifeArea';

@Entity({ tableName: 'skills' })
export class Skill extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'string' })
  title!: string;

  /**
   * TipTap rich text HTML content for skill notes, guides, and playbooks
   */
  @Property({ type: 'text' })
  content!: string;

  @ManyToOne(() => LifeArea, { nullable: true, deleteRule: 'set null' })
  lifeArea?: Rel<LifeArea>;

  @ManyToOne(() => User, { nullable: true, deleteRule: 'cascade' })
  user?: Rel<User>;
}
