'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { withRequestContext } from '@/db';
import { LOCALE_COOKIE } from '@/features/general/lib/i18n/config';
import { createSession } from '../lib/session';
import type { LoginFormState } from '../lib/definitions';

/**
 * Server Action mutation for handling user login and registration directly with client-side forms.
 * Follows the login-or-create pattern:
 * - If user exists in DB and password matches: authenticates user and logs in.
 * - If user is new (does not exist in DB): creates new user record and logs in.
 * - If user exists but password does not match (or duplicate name conflict): returns "نام کاربری یا رمز عبور اشتباه است."
 */
export async function loginMutation(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const isEn = currentLocale === 'en';

  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const errors: NonNullable<LoginFormState>['errors'] = {};

  if (!username) {
    errors.username = [isEn ? 'Username is required.' : 'نام کاربری الزامی است.'];
  } else if (username.length < 3) {
    errors.username = [
      isEn
        ? 'Username must be at least 3 characters long.'
        : 'نام کاربری باید حداقل ۳ کاراکتر باشد.',
    ];
  }

  if (!password) {
    errors.password = [isEn ? 'Password is required.' : 'رمز عبور الزامی است.'];
  } else if (password.length < 6) {
    errors.password = [
      isEn
        ? 'Password must be at least 6 characters long.'
        : 'رمز عبور باید حداقل ۶ کاراکتر باشد.',
    ];
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      inputs: { username },
    };
  }

  // Real database authentication: Login existing user or create a new user record
  const result = await withRequestContext(async ({ user }) => {
    return await user.loginOrCreate(username, password, {
      locale: isEn ? 'en' : 'fa',
    });
  });

  if (result.status === 'INVALID_CREDENTIALS' || !result.user) {
    return {
      message: isEn
        ? 'Invalid username or password.'
        : 'نام کاربری یا رمز عبور اشتباه است.',
      inputs: { username },
    };
  }

  await createSession({
    userId: String(result.user.id),
    username: result.user.username,
  });

  redirect('/');
}
