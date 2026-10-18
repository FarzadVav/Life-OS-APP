import 'reflect-metadata';
import {
  MikroORM,
  RequestContext,
  type Options,
  type EntityManager,
  type EntityRepository,
} from '@mikro-orm/postgresql';
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
  framework: FrameworkRepository;
  frameworkItem: FrameworkRepository;
}

declare global {
  var __mikro_orm_cache__: Services | undefined;
}

function createServices(orm: MikroORM, em: EntityManager): Services {
  const frameworkRepo = new FrameworkRepository(em, FrameworkItem);
  return {
    orm,
    em,
    user: new UserRepository(em, User),
    todo: new TodoRepository(em, Todo),
    todoAction: new TodoActionRepository(em, TodoAction),
    todoDiscipline: new TodoDisciplineRepository(em, TodoDiscipline),
    disciplineHistory: em.getRepository(DisciplineHistory),
    journal: new JournalRepository(em, Journal),
    framework: frameworkRepo,
    frameworkItem: frameworkRepo,
  };
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

  const services = createServices(orm, orm.em);

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
  const { orm } = await initORM();
  return RequestContext.create(orm.em, () => {
    const scopedServices = createServices(orm, orm.em);
    return callback(scopedServices);
  });
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
