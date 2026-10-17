import 'reflect-metadata';
import path from 'node:path';
import { defineConfig } from '@mikro-orm/sqlite';
import { SeedManager } from '@mikro-orm/seeder';
import {
  User,
  Todo,
  TodoAction,
  TodoDiscipline,
  DisciplineHistory,
  Journal,
  FrameworkItem,
} from './entities';

const dbPath = process.env.DATABASE_FILE || path.resolve(process.cwd(), 'data', 'life-os.db');

export const config = defineConfig({
  dbName: dbPath,
  entities: [
    User,
    Todo,
    TodoAction,
    TodoDiscipline,
    DisciplineHistory,
    Journal,
    FrameworkItem,
  ],
  extensions: [SeedManager],
  allowGlobalContext: true,
  debug: process.env.NODE_ENV === 'development',
  seeder: {
    path: path.resolve(process.cwd(), 'db', 'seeders'),
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
});

export default config;
