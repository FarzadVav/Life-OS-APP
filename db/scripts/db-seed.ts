import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import { MikroORM } from '@mikro-orm/sqlite';
import config from '../mikro-orm.config';
import { DatabaseSeeder } from '../seeders/DatabaseSeeder';

async function dbSeed() {
  console.log('🌱 Starting db:seed process...');

  const dbPath = (config as { dbName?: string }).dbName || path.resolve(process.cwd(), 'data', 'life-os.db');
  const dbDir = path.dirname(dbPath);
  if (dbDir && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const orm = await MikroORM.init(config);

  try {
    // Ensure tables exist before seeding
    await orm.schema.update();

    const seeder = orm.seeder;
    await seeder.seed(DatabaseSeeder);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  } finally {
    await orm.close(true);
  }
}

dbSeed().catch((err) => {
  console.error('❌ Fatal error in db:seed:', err);
  process.exit(1);
});
