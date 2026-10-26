'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { ForbiddenReferenceError } from '@/features/general/lib/errors';
import { CreateFrameworkSchema, type FrameworkFormState } from '../types';

export async function createFrameworkMutation(
  prevState: FrameworkFormState,
  formData: FormData,
): Promise<FrameworkFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const lifeAreaIdRaw = formData.get('lifeAreaId');
  const lifeAreaId =
    lifeAreaIdRaw && lifeAreaIdRaw !== '' && lifeAreaIdRaw !== '0' && lifeAreaIdRaw !== 'none'
      ? Number(lifeAreaIdRaw)
      : null;

  const validation = CreateFrameworkSchema({
    title,
    ...(description ? { description } : {}),
    ...(lifeAreaId !== undefined ? { lifeAreaId } : {}),
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<FrameworkFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'description'
        | 'lifeAreaId'
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
      },
      success: false,
    };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return {
      errors: { general: ['Your session has expired. Please sign in again.'] },
      inputs: { title, description, lifeAreaId },
      success: false,
    };
  }

  const inputs = { title, description, lifeAreaId };

  let created;
  try {
    created = await withRequestContext(async ({ framework }) => {
      return await framework.createFramework(
        {
          title,
          description,
          lifeAreaId,
        },
        userId,
      );
    });
  } catch (error) {
    if (error instanceof ForbiddenReferenceError) {
      return { errors: { lifeAreaId: ['This value is not available to you.'] }, inputs, success: false };
    }
    throw error;
  }

  return {
    success: true,
    frameworkId: created.id,
    inputs,
  };
}
