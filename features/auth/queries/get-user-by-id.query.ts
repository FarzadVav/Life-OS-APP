import 'server-only';
import { withRequestContext } from '@/db';
import type { AuthUser } from '../lib/definitions';

/**
 * Retrieves a user profile by ID via UserRepository.
 */
export async function getUserByIdQuery(id: number): Promise<AuthUser | null> {
  return withRequestContext(async ({ user }) => {
    const record = await user.findById(id);
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
