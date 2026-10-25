import 'server-only';
import { cache } from 'react';

import { AuthenticationError } from '@/features/general/lib/errors';
import { getSessionQuery } from '../queries/get-session.query';

/**
 * Resolves the acting user for the current request, memoized per request so a
 * single server action does not re-decrypt the session cookie repeatedly.
 *
 * Returns null rather than throwing so the result is cacheable; callers choose
 * the failure mode that fits their boundary.
 */
export const getUserId = cache(async (): Promise<number | null> => {
  const session = await getSessionQuery();
  if (!session?.userId) {
    return null;
  }

  const userId = Number(session.userId);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
});

/**
 * Route handlers and server queries: a missing session is an error condition.
 */
export async function requireUserId(): Promise<number> {
  const userId = await getUserId();
  if (userId === null) {
    throw new AuthenticationError();
  }

  return userId;
}

/**
 * Server Actions: returns null instead of throwing so the caller can surface the
 * failure through its own form state instead of an unhandled action rejection.
 */
export async function tryGetUserId(): Promise<number | null> {
  return getUserId();
}
