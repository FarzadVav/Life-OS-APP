'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { CreateLifeAreaSchema, type LifeAreaFormState } from '../types';

/**
 * Server Action mutation for creating a Life Area from a client-side form.
 */
export async function createLifeAreaMutation(
  prevState: LifeAreaFormState,
  formData: FormData,
): Promise<LifeAreaFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const vision = String(formData.get('vision') ?? '');

  const validation = CreateLifeAreaSchema({ title, vision });

  if (validation instanceof type.errors) {
    const errors: NonNullable<LifeAreaFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'vision'
        | 'general';

      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field]?.push(problem.message);
    }

    return {
      errors,
      inputs: { title, vision },
      success: false,
    };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return {
      errors: { general: ['Your session has expired. Please sign in again.'] },
      inputs: { title, vision },
      success: false,
    };
  }

  const created = await withRequestContext(async ({ lifeArea }) => {
    return await lifeArea.createLifeArea({ title, vision }, userId);
  });

  return {
    success: true,
    lifeAreaId: created.id,
    inputs: { title, vision },
  };
}
