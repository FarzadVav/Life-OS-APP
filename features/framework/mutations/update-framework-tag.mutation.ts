'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { lifeAreaFieldError } from '@/features/life-areas/lib/lifeAreaFieldError';
import { parseLifeAreaSlug } from '@/features/general/lib/lifeAreaSlug';
import { UpdateFrameworkTagSchema, type FrameworkTagFormState } from '../types';

function readLifeAreaId(formData: FormData): number | null {
  return parseLifeAreaSlug(String(formData.get('lifeAreaId') ?? '')) ?? null;
}

export async function updateFrameworkTagMutation(
  prevState: FrameworkTagFormState,
  formData: FormData,
): Promise<FrameworkTagFormState> {
  const id = Number(formData.get('id') ?? formData.get('editId'));

  if (!id || Number.isNaN(id)) {
    return { errors: { general: ['Invalid or missing tag ID.'] }, success: false };
  }

  const title = formData.has('title')
    ? String(formData.get('title') ?? '').trim()
    : undefined;
  const lifeAreaId = formData.has('lifeAreaId')
    ? readLifeAreaId(formData)
    : undefined;

  const validation = UpdateFrameworkTagSchema({
    id,
    ...(title !== undefined ? { title } : {}),
    ...(lifeAreaId !== undefined ? { lifeAreaId } : {}),
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<FrameworkTagFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'lifeAreaId'
        | 'general';

      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field]?.push(problem.message);
    }

    return {
      errors,
      inputs: { id, title, lifeAreaId },
      success: false,
    };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return {
      errors: { general: ['Your session has expired. Please sign in again.'] },
      inputs: { id, title, lifeAreaId },
      success: false,
    };
  }

  try {
    const updated = await withRequestContext(async ({ frameworkTag }) => {
      return await frameworkTag.updateTag(id, { id, title, lifeAreaId }, userId);
    });

    if (!updated) {
      return {
        errors: { general: ['Tag not found or unauthorized.'] },
        success: false,
      };
    }

    return { success: true, tagId: id, inputs: { id, title, lifeAreaId } };
  } catch (error) {
    const fieldError = lifeAreaFieldError(error);
    if (fieldError) {
      return {
        errors: { lifeAreaId: [fieldError] },
        inputs: { id, title, lifeAreaId },
        success: false,
      };
    }
    throw error;
  }
}
