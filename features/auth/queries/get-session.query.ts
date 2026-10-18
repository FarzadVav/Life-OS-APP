import 'server-only';
import { cookies } from 'next/headers';
import { decrypt } from '../lib/session';

export type SessionQueryResult = {
  isAuth: boolean;
  userId: string;
  username: string;
} | null;

/**
 * Retrieves the current session data from HTTP cookies.
 */
export async function getSessionQuery(): Promise<SessionQueryResult> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  const payload = await decrypt(sessionCookie);
  if (!payload?.userId) {
    return null;
  }

  return {
    isAuth: true,
    userId: String(payload.userId),
    username: String(payload.username ?? ''),
  };
}
