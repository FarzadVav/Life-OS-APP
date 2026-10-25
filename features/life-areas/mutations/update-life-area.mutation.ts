'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { UpdateLifeAreaSchema, type LifeAreaFormState } from '../types';

/**
 * Server Action mutation for updating an existing Life Area from a client-side form.
 */
export async function updateLifeAreaMutation(
  prevState: LifeAreaFormState,
  formData: FormData,
): Promise<LifeAreaFormState> {
  const idRaw = formData.get('id') || formData.get('editId');
  const id = Number(idRaw);
  const title = String(formData.get('title') ?? '').trim();
  const vision = String(formData.get('vision') ?? '');

  if (!id || Number.isNaN(id)) {
    return {
      errors: { general: ['Invalid or missing life area ID.'] },
      inputs: { title, vision },
      success: false,
    };
  }

  const validation = UpdateLifeAreaSchema({ id, title, vision });

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

  const updated = await withRequestContext(async ({ lifeArea }) => {
    return await lifeArea.updateLifeArea(id, { title, vision }, userId);
  });

  if (!updated) {
    return {
      errors: { general: ['Life area not found or unauthorized.'] },
      inputs: { title, vision },
      success: false,
    };
  }

  return {
    success: true,
    lifeAreaId: updated.id,
    inputs: { title, vision },
  };
}
