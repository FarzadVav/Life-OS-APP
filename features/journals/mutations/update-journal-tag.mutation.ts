'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import {
  UpdateJournalTagSchema,
  type JournalTagFormState,
  type JournalCategory,
} from '../types';

export async function updateJournalTagMutation(
  prevState: JournalTagFormState,
  formData: FormData,
): Promise<JournalTagFormState> {
  const idRaw = formData.get('id') || formData.get('editId');
  const id = Number(idRaw);

  if (!id || isNaN(id)) {
    return {
      errors: {
        general: ['Invalid or missing tag ID.'],
      },
      success: false,
    };
  }

  const title = formData.has('title')
    ? String(formData.get('title') ?? '').trim()
    : undefined;
  const category = formData.has('category')
    ? (String(formData.get('category')) as JournalCategory)
    : undefined;

  const updatePayload = {
    id,
    ...(title !== undefined ? { title } : {}),
    ...(category !== undefined ? { category } : {}),
  };

  const validation = UpdateJournalTagSchema(updatePayload);
  if (validation instanceof type.errors) {
    const errors: NonNullable<JournalTagFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'category'
        | 'general';

      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field]?.push(problem.message);
    }

    return {
      errors,
      inputs: {
        id,
        title,
        category,
      },
      success: false,
    };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return {
      errors: { general: ['Your session has expired. Please sign in again.'] },
      inputs: {
        id,
        title,
        category,
      },
      success: false,
    };
  }

  const updated = await withRequestContext(async ({ journalTag }) => {
    return await journalTag.updateTag(
      id,
      {
        id,
        title,
        category,
      },
      userId,
    );
  });

  if (!updated) {
    return {
      errors: {
        general: ['Tag not found or unauthorized.'],
      },
      success: false,
    };
  }

  return {
    success: true,
    tagId: id,
    inputs: {
      id,
      title,
      category,
    },
  };
}
