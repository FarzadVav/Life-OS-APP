import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/postgresql';
import config from '../mikro-orm.config';

async function dbPush() {
  console.log('🔄 Running db:push (PostgreSQL Schema Synchronization)...');

  const orm = await MikroORM.init(config);

  try {
    // Drop framework_items table if it still exists
    await orm.em.getConnection().execute('DROP TABLE IF EXISTS "framework_items" CASCADE;');
    console.log('🗑️ Ensured framework_items table is removed from PostgreSQL.');

    const generator = orm.schema;
    const updateDump = await generator.getUpdateSchemaSQL({ wrap: false, dropTables: true });

    if (!updateDump.trim()) {
      console.log('✅ Database schema is already up to date! No changes needed.');
    } else {
      console.log('🔨 Applying schema changes to PostgreSQL:');
      console.log(updateDump.trim());
      await generator.update({ dropTables: true });
      console.log('✨ Database schema successfully synchronized!');
    }
  } catch (error) {
    console.warn('⚠️ Update check notice, attempting fresh create if empty...', (error as Error).message);
    try {
      await orm.schema.create();
      console.log('✨ Fresh database schema created successfully on PostgreSQL!');
    } catch (createError) {
      console.error('❌ Failed to push schema to PostgreSQL:', createError);
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
