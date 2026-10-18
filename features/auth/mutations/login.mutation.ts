'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { withRequestContext } from '@/db';
import { LOCALE_COOKIE } from '@/features/general/lib/i18n/config';
import { createSession } from '../lib/session';
import { type } from 'arktype';
import { LoginInputSchema, type LoginFormState } from '../lib/definitions';

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

  // Validate form inputs using ArkType schema
  const validation = LoginInputSchema({ username, password });
  if (validation instanceof type.errors) {
    const errors: NonNullable<LoginFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? '') as 'username' | 'password';
      if (field === 'username' || field === 'password') {
        if (!errors[field]) {
          errors[field] = [];
        }
        const msg = isEn
          ? problem.message
          : field === 'username'
            ? username.length === 0
              ? 'نام کاربری الزامی است.'
              : 'نام کاربری باید حداقل ۳ کاراکتر باشد.'
            : password.length === 0
              ? 'رمز عبور الزامی است.'
              : 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
        errors[field]?.push(msg);
      }
    }

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
