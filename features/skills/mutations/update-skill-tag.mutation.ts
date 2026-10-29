'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { lifeAreaFieldError } from '@/features/life-areas/lib/lifeAreaFieldError';
import { UpdateSkillTagSchema, type SkillTagFormState } from '../types';
import { parseLifeAreaSlug } from "@/features/general/lib/lifeAreaSlug";

function readLifeAreaId(formData: FormData): number | null {
  return parseLifeAreaSlug(String(formData.get('lifeAreaId') ?? '')) ?? null;
}

export async function updateSkillTagMutation(
  prevState: SkillTagFormState,
  formData: FormData,
): Promise<SkillTagFormState> {
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

  const validation = UpdateSkillTagSchema({
    id,
    ...(title !== undefined ? { title } : {}),
    ...(lifeAreaId !== undefined ? { lifeAreaId } : {}),
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<SkillTagFormState>['errors'] = {};

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
    const updated = await withRequestContext(async ({ skillTag }) => {
      return await skillTag.updateTag(id, { id, title, lifeAreaId }, userId);
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
