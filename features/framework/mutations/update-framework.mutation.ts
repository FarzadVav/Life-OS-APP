'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { ForbiddenReferenceError } from '@/features/general/lib/errors';
import { UpdateFrameworkSchema, type FrameworkFormState } from '../types';

export async function updateFrameworkMutation(
  prevState: FrameworkFormState,
  formData: FormData,
): Promise<FrameworkFormState> {
  const idRaw = formData.get('id');
  const id = idRaw ? Number(idRaw) : NaN;
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const lifeAreaIdRaw = formData.get('lifeAreaId');
  const lifeAreaId =
    lifeAreaIdRaw && lifeAreaIdRaw !== '' && lifeAreaIdRaw !== '0' && lifeAreaIdRaw !== 'none'
      ? Number(lifeAreaIdRaw)
      : null;

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

  let updated;
  try {
    updated = await withRequestContext(async ({ framework }) => {
      return await framework.updateFramework(
        id,
        {
          title: title || undefined,
          description,
          lifeAreaId,
        },
        userId,
      );
    });
  } catch (error) {
    if (error instanceof ForbiddenReferenceError) {
      return {
        errors: { lifeAreaId: ['This value is not available to you.'] },
        inputs: { title, description, lifeAreaId },
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
    },
  };
}
