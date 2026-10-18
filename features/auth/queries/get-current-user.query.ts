import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from './get-session.query';
import type { AuthUser } from '../lib/definitions';

/**
 * Retrieves the currently authenticated user from the database via UserRepository.
 */
export async function getCurrentUserQuery(): Promise<AuthUser | null> {
  const session = await getSessionQuery();
  if (!session?.userId) {
    return null;
  }

  const userId = Number(session.userId);
  if (isNaN(userId)) {
    return null;
  }

  return withRequestContext(async ({ user }) => {
    const record = await user.findById(userId);
    if (!record) {
      return null;
    }

    return {
      id: record.id,
      username: record.username,
      name: record.name ?? null,
      email: record.email ?? null,
      locale: record.locale,
      colorScheme: record.colorScheme,
      createdAt: record.createdAt.toISOString(),
    };
  });
}
