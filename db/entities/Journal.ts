import { OptionalProps } from '@mikro-orm/core';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { JournalRepository } from '@/features/journals/repositories/journal.repository';

export enum JournalCategory {
  LOGS = 'Logs',
  THOUGHTS = 'Thoughts',
  FEELINGS = 'Feelings',
  LESSONS = 'Lessons',
  IDEAS = 'Ideas',
  NOTES = 'Notes',
}

@Entity({ tableName: 'journals', repository: () => JournalRepository })
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
  user?: User;
}
