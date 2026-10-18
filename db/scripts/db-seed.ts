import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/postgresql';
import config from '../mikro-orm.config';
import { DatabaseSeeder } from '../seeders/DatabaseSeeder';

async function dbSeed() {
  console.log('🌱 Starting db:seed process on PostgreSQL...');

  const orm = await MikroORM.init(config);

  try {
    // Ensure tables exist before seeding
    await orm.schema.update();

    const seeder = orm.seeder;
    await seeder.seed(DatabaseSeeder);

    console.log('✅ PostgreSQL seeding completed successfully!');
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
