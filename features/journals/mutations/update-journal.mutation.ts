'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { UpdateJournalSchema, type JournalFormState, type JournalCategory } from '../types';

/**
 * Server Action mutation for updating an existing Journal entry.
 * Directly connects to client-side forms following Base UI and Next.js form guidelines.
 */
export async function updateJournalMutation(
  prevState: JournalFormState,
  formData: FormData,
): Promise<JournalFormState> {
  const idRaw = formData.get('id') || formData.get('editId');
  const id = Number(idRaw);

  if (!id || isNaN(id)) {
    return {
      errors: {
        general: ['Invalid or missing journal ID.'],
      },
      success: false,
    };
  }

  const title = formData.has('title') ? String(formData.get('title') ?? '').trim() : undefined;
  const content = formData.has('content') ? String(formData.get('content') ?? '').trim() : undefined;
  const category = formData.has('type') ? (String(formData.get('type')) as JournalCategory) : undefined;

  const updatePayload = {
    id,
    ...(title !== undefined ? { title } : {}),
    ...(content !== undefined ? { content } : {}),
    ...(category !== undefined ? { type: category } : {}),
  };

  const validation = UpdateJournalSchema(updatePayload);
  if (validation instanceof type.errors) {
    const errors: NonNullable<JournalFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'content'
        | 'type'
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
        content,
        type: category,
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
        content,
        type: category,
      },
      success: false,
    };
  }

  const updated = await withRequestContext(async ({ journal }) => {
    return await journal.updateJournal(
      id,
      {
        title,
        content,
        type: category,
      },
      userId,
    );
  });

  if (!updated) {
    return {
      errors: {
        general: ['Journal entry not found or unauthorized.'],
      },
      success: false,
    };
  }

  return {
    success: true,
    journalId: id,
    inputs: {
      id,
      title,
      content,
      type: category,
    },
  };
}
