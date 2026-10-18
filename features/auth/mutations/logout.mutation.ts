'use server';

import { redirect } from 'next/navigation';
import { deleteSession } from '../lib/session';

/**
 * Server Action mutation for terminating user session and logging out.
 * Directly invokable by client-side forms.
 */
export async function logoutMutation(): Promise<void> {
  await deleteSession();
  redirect('/login');
}
