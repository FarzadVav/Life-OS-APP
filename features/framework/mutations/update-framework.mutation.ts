'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { lifeAreaFieldError } from '@/features/life-areas/lib/lifeAreaFieldError';
import { parseLifeAreaSlug } from '@/features/general/lib/lifeAreaSlug';
import { UpdateFrameworkSchema, type FrameworkFormState } from '../types';

export async function updateFrameworkMutation(
  prevState: FrameworkFormState,
  formData: FormData,
): Promise<FrameworkFormState> {
  const idRaw = formData.get('id');
  const id = idRaw ? Number(idRaw) : NaN;
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const lifeAreaId = parseLifeAreaSlug(String(formData.get('lifeAreaId') ?? '')) ?? null;
  const rawTag = formData.get('tag');
  const tag = rawTag && String(rawTag).trim() ? String(rawTag).trim() : null;

  if (!id || Number.isNaN(id)) {
    return {
      errors: { general: ['Invalid framework id'] },
      success: false,
    };
  }

  const validation = UpdateFrameworkSchema({
    id,
    title: title || undefined,
    ...(description ? { description } : {}),
    lifeAreaId,
    tag,
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<FrameworkFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'description'
        | 'lifeAreaId'
        | 'tag'
        | 'general';

      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field]?.push(problem.message);
    }

    return {
      errors,
      inputs: {
        title,
        description,
        lifeAreaId,
        tag,
      },
      success: false,
    };
  }

  const userId = await tryGetUserId();
  const inputs = { title, description, lifeAreaId, tag };
  if (userId === null) {
    return {
      errors: { general: ['Your session has expired. Please sign in again.'] },
      inputs,
      success: false,
    };
  }

  let updated;
  try {
    updated = await withRequestContext(async ({ framework }) => {
      return await framework.updateFramework(
        id,
        {
          title: title || undefined,
          description,
          lifeAreaId,
          tag,
        },
        userId,
      );
    });
  } catch (error) {
    const fieldError = lifeAreaFieldError(error);
    if (fieldError) {
      return {
        errors: { lifeAreaId: [fieldError] },
        inputs,
        success: false,
      };
    }
    throw error;
  }

  if (!updated) {
    return {
      errors: { general: ['Framework not found'] },
      success: false,
    };
  }

  return {
    success: true,
    frameworkId: updated.id,
    inputs: {
      title: updated.title,
      description: updated.description,
      lifeAreaId: updated.lifeArea?.id ?? null,
      tag: updated.tag ?? null,
    },
  };
}
