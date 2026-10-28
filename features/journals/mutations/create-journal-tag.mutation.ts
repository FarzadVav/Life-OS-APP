'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import {
  CreateJournalTagSchema,
  type JournalTagFormState,
  type JournalCategory,
} from '../types';

export async function createJournalTagMutation(
  prevState: JournalTagFormState,
  formData: FormData,
): Promise<JournalTagFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const category = String(formData.get('category') ?? 'Logs') as JournalCategory;

  const validation = CreateJournalTagSchema({
    title,
    category,
  });

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
        title,
        category,
      },
      success: false,
    };
  }

  const created = await withRequestContext(async ({ journalTag }) => {
    return await journalTag.createTag(
      {
        title,
        category,
      },
      userId,
    );
  });

  return {
    success: true,
    tagId: created.id,
    inputs: {
      title,
      category,
    },
  };
}
