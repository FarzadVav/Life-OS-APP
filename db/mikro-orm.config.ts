import 'reflect-metadata';
import path from 'node:path';
import { defineConfig } from '@mikro-orm/postgresql';
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

// Supabase project xeigermybdqjnruwhcss (ap-northeast-1).
// Dual-stack IPv4/IPv6 pooler connection string guarantees connectivity across all environments.
const defaultSupabaseUrl =
  'postgresql://postgres.xeigermybdqjnruwhcss:UpUpAndAwayIveBeen091@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';

const connectionString = process.env.DATABASE_URL || defaultSupabaseUrl;

export const config = defineConfig({
  clientUrl: connectionString,
  schema: 'public',
  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
    ignoreSchema: [
      'auth',
      'storage',
      'realtime',
      'vault',
      'extensions',
      'graphql',
      'graphql_public',
      'pgbouncer',
      'pg_catalog',
      'information_schema',
      'pgsodium',
      'pgsodium_masks',
    ],
    ignoreTriggers: true,
    ignoreRoutines: true,
  },
  driverOptions: {
    ssl: { rejectUnauthorized: false },
  },
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
