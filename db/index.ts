import 'reflect-metadata';
import {
  MikroORM,
  RequestContext,
  type Options,
  type EntityManager,
  type EntityRepository,
} from '@mikro-orm/sqlite';
import config from './mikro-orm.config';
import {
  User,
  Todo,
  TodoAction,
  TodoDiscipline,
  DisciplineHistory,
  Journal,
  FrameworkItem,
} from './entities';
import { UserRepository } from '@/features/auth/repositories';
import {
  TodoRepository,
  TodoActionRepository,
  TodoDisciplineRepository,
} from '@/features/todos/repositories';
import { JournalRepository } from '@/features/journals/repositories';
import { FrameworkRepository } from '@/features/framework/repositories';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  user: UserRepository;
  todo: TodoRepository;
  todoAction: TodoActionRepository;
  todoDiscipline: TodoDisciplineRepository;
  disciplineHistory: EntityRepository<DisciplineHistory>;
  journal: JournalRepository;
  frameworkItem: FrameworkRepository;
}

declare global {
  var __mikro_orm_cache__: Services | undefined;
}

/**
 * Initializes and returns the MikroORM services singleton with custom feature repositories.
 */
export async function initORM(options?: Partial<Options>): Promise<Services> {
  if (globalThis.__mikro_orm_cache__) {
    return globalThis.__mikro_orm_cache__;
  }

  const orm = await MikroORM.init({
    ...config,
    ...options,
  });

  const em = orm.em;

  const services: Services = {
    orm,
    em,
    user: em.getRepository(User) as UserRepository,
    todo: em.getRepository(Todo) as TodoRepository,
    todoAction: em.getRepository(TodoAction) as TodoActionRepository,
    todoDiscipline: em.getRepository(TodoDiscipline) as TodoDisciplineRepository,
    disciplineHistory: em.getRepository(DisciplineHistory),
    journal: em.getRepository(Journal) as JournalRepository,
    frameworkItem: em.getRepository(FrameworkItem) as FrameworkRepository,
  };

  if (process.env.NODE_ENV !== 'production') {
    globalThis.__mikro_orm_cache__ = services;
  }

  return services;
}

/**
 * Executes a callback within a request-isolated context using RequestContext.create.
 * Essential for Server Components, Route Handlers, and Server Actions in Next.js.
 */
export async function withRequestContext<T>(
  callback: (services: Services) => Promise<T>,
): Promise<T> {
  const services = await initORM();
  return RequestContext.create(services.orm.em, () => callback(services));
}

/**
 * Returns a fresh or current EntityManager for queries.
 */
export async function getEntityManager(): Promise<EntityManager> {
  const { em } = await initORM();
  return em.fork();
}

/**
 * Returns the underlying MikroORM instance.
 */
export async function getOrm(): Promise<MikroORM> {
  const { orm } = await initORM();
  return orm;
}

export * from './entities';
export { config } from './mikro-orm.config';
