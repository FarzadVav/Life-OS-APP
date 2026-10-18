import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSessionQuery, getCurrentUserQuery } from '../queries';
import type { AuthUser } from './definitions';

/**
 * Verifies that the user has a valid active session.
 * If not authenticated, redirects directly to /login.
 */
export const verifySession = cache(async () => {
  const session = await getSessionQuery();
  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId, username: session.username };
});

/**
 * Retrieves the current user from the database via UserRepository (wrapped with React cache).
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  return getCurrentUserQuery();
});
