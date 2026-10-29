'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { lifeAreaFieldError } from '@/features/life-areas/lib/lifeAreaFieldError';
import { parseLifeAreaSlug } from '@/features/general/lib/lifeAreaSlug';
import { CreateFrameworkTagSchema, type FrameworkTagFormState } from '../types';

function readLifeAreaId(formData: FormData): number | null {
  return parseLifeAreaSlug(String(formData.get('lifeAreaId') ?? '')) ?? null;
}

export async function createFrameworkTagMutation(
  prevState: FrameworkTagFormState,
  formData: FormData,
): Promise<FrameworkTagFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const lifeAreaId = readLifeAreaId(formData);

  const validation = CreateFrameworkTagSchema({ title, lifeAreaId });

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

    return { errors, inputs: { title, lifeAreaId }, success: false };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return {
      errors: { general: ['Your session has expired. Please sign in again.'] },
      inputs: { title, lifeAreaId },
      success: false,
    };
  }

  try {
    const created = await withRequestContext(async ({ frameworkTag }) => {
      return await frameworkTag.createTag({ title, lifeAreaId }, userId);
    });

    return { success: true, tagId: created.id, inputs: { title, lifeAreaId } };
  } catch (error) {
    const fieldError = lifeAreaFieldError(error);
    if (fieldError) {
      return {
        errors: { lifeAreaId: [fieldError] },
        inputs: { title, lifeAreaId },
        success: false,
      };
    }
    throw error;
  }
}
