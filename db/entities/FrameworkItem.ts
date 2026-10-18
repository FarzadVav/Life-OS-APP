import { OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { FrameworkCategory, FrameworkSection } from './enums';

export { FrameworkCategory, FrameworkSection };

@Entity({ tableName: 'framework_items' })
export class FrameworkItem extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'string' })
  title!: string;

  /**
   * TipTap rich text HTML or markdown content
   */
  @Property({ type: 'text' })
  content!: string;

  @Enum({ items: () => FrameworkCategory })
  category!: FrameworkCategory;

  @Enum({ items: () => FrameworkSection })
  section!: FrameworkSection;

  @ManyToOne(() => User, { nullable: true, deleteRule: 'cascade' })
  user?: Rel<User>;
}
