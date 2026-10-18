import { OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { JournalCategory } from './enums';

export { JournalCategory };

@Entity({ tableName: 'journals' })
export class Journal extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'type';

  @Property({ type: 'string' })
  title!: string;

  /**
   * Rich text TipTap content (HTML or markdown)
   */
  @Property({ type: 'text' })
  content!: string;

  @Enum({ items: () => JournalCategory, default: JournalCategory.LOGS })
  type: JournalCategory = JournalCategory.LOGS;

  @ManyToOne(() => User, { nullable: true, deleteRule: 'cascade' })
  user?: Rel<User>;
}
