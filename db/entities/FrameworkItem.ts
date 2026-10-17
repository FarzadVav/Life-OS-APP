import { OptionalProps } from '@mikro-orm/core';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { FrameworkRepository } from '@/features/framework/repositories/framework.repository';

export enum FrameworkCategory {
  CAREER = 'Career',
  MINDSET = 'Mindset',
  SOCIAL = 'Social',
  HEALTH = 'Health',
  BEHAVIOR = 'Behavior',
  FINANCE = 'Finance',
  LIFESTYLE = 'Lifestyle',
  KNOWLEDGE = 'Knowledge',
}

export enum FrameworkSection {
  VISIONS = 'Visions',
  RULES = 'Rules',
  CONCEPTS = 'Concepts',
}

@Entity({ tableName: 'framework_items', repository: () => FrameworkRepository })
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
  user?: User;
}
