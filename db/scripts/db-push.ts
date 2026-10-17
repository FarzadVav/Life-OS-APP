import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import { MikroORM } from '@mikro-orm/sqlite';
import config from '../mikro-orm.config';

async function dbPush() {
  console.log('🔄 Running db:push (Schema Synchronization)...');

  const dbPath = (config as { dbName?: string }).dbName || path.resolve(process.cwd(), 'data', 'life-os.db');
  const dbDir = path.dirname(dbPath);
  if (dbDir && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`📁 Created database directory at: ${dbDir}`);
  }

  const orm = await MikroORM.init(config);

  try {
    const generator = orm.schema;
    const updateDump = await generator.getUpdateSchemaSQL({ wrap: false });

    if (!updateDump.trim()) {
      console.log('✅ Database schema is already up to date! No changes needed.');
    } else {
      console.log('🔨 Applying schema changes to SQLite:');
      console.log(updateDump.trim());
      await generator.update();
      console.log('✨ Database schema successfully synchronized!');
    }
  } catch (error) {
    console.warn('⚠️ Update check notice, attempting fresh create if empty...', (error as Error).message);
    try {
      await orm.schema.create();
      console.log('✨ Fresh database schema created successfully!');
    } catch (createError) {
      console.error('❌ Failed to push schema to database:', createError);
      process.exit(1);
    }
  } finally {
    await orm.close(true);
  }
}

dbPush().catch((err) => {
  console.error('❌ Fatal error in db:push:', err);
  process.exit(1);
});
