'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { lifeAreaFieldError } from '@/features/life-areas/lib/lifeAreaFieldError';
import { parseLifeAreaSlug } from '@/features/general/lib/lifeAreaSlug';
import { CreateFrameworkSchema, type FrameworkFormState } from '../types';

export async function createFrameworkMutation(
  prevState: FrameworkFormState,
  formData: FormData,
): Promise<FrameworkFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const lifeAreaId = parseLifeAreaSlug(String(formData.get('lifeAreaId') ?? '')) ?? null;
  const rawTag = formData.get('tag');
  const tag = rawTag && String(rawTag).trim() ? String(rawTag).trim() : null;

  const validation = CreateFrameworkSchema({
    title,
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

  let created;
  try {
    created = await withRequestContext(async ({ framework }) => {
      return await framework.createFramework(
        {
          title,
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
      return { errors: { lifeAreaId: [fieldError] }, inputs, success: false };
    }
    throw error;
  }

  return {
    success: true,
    frameworkId: created.id,
    inputs,
  };
}
