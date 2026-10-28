import { OptionalProps, type Rel } from '@mikro-orm/core';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { JournalCategory } from './enums';

export { JournalCategory };

@Entity({ tableName: 'journal_tags' })
export class JournalTag extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'string' })
  title!: string;

  @Enum({ items: () => JournalCategory, default: JournalCategory.LOGS })
  category: JournalCategory = JournalCategory.LOGS;

  @ManyToOne(() => User, { nullable: true, deleteRule: 'cascade' })
  user?: Rel<User>;
}
