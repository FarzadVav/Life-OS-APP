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
  LifeArea,
  Skill,
  Habit,
  HabitHistory,
} from './entities';
import { UserRepository } from '@/features/auth/repositories';
import {
  TodoRepository,
  TodoActionRepository,
  TodoDisciplineRepository,
} from '@/features/todos/repositories';
import { JournalRepository } from '@/features/journals/repositories';
import { LifeAreaRepository } from '@/features/life-areas/repositories';
import { SkillRepository } from '@/features/skills/repositories';
import { HabitRepository } from '@/features/habits/repositories';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  user: UserRepository;
  todo: TodoRepository;
  todoAction: TodoActionRepository;
  todoDiscipline: TodoDisciplineRepository;
  disciplineHistory: EntityRepository<DisciplineHistory>;
  journal: JournalRepository;
  lifeArea: LifeAreaRepository;
  skill: SkillRepository;
  habit: HabitRepository;
  habitHistory: EntityRepository<HabitHistory>;
}

declare global {
  var __mikro_orm_cache__: Services | undefined;
}

function createServices(orm: MikroORM, em: EntityManager): Services {
  return {
    orm,
    em,
    user: new UserRepository(em, User),
    todo: new TodoRepository(em, Todo),
    todoAction: new TodoActionRepository(em, TodoAction),
    todoDiscipline: new TodoDisciplineRepository(em, TodoDiscipline),
    disciplineHistory: em.getRepository(DisciplineHistory),
    journal: new JournalRepository(em, Journal),
    lifeArea: new LifeAreaRepository(em, LifeArea),
    skill: new SkillRepository(em, Skill),
    habit: new HabitRepository(em, Habit),
    habitHistory: em.getRepository(HabitHistory),
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
  const services = await initORM();
  return services.em;
}

export default initORM;
