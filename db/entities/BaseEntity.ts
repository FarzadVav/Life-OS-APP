import { OptionalProps } from '@mikro-orm/core';
import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

export abstract class BaseEntity {
  [OptionalProps]?: string;

  @PrimaryKey({ type: 'integer' })
  id!: number;

  @Property({ type: 'datetime', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'datetime', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
