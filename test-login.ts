import 'reflect-metadata';
import { withRequestContext } from './db';

async function test() {
  console.log('Testing loginOrCreate with admin / password123...');
  try {
    const res = await withRequestContext(async ({ user }) => {
      return await user.loginOrCreate('admin', 'password123');
    });
    console.log('Admin login result:', res.status, res.user?.id, res.user?.username);
  } catch (err) {
    console.error('Error during admin loginOrCreate:', err);
  }
  process.exit(0);
}

test();
