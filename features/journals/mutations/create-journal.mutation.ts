'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { CreateJournalSchema, type JournalFormState, type JournalCategory } from '../types';

/**
 * Server Action mutation for creating a new Journal entry.
 * Directly connects to client-side forms following Base UI and Next.js form guidelines.
 */
export async function createJournalMutation(
  prevState: JournalFormState,
  formData: FormData,
): Promise<JournalFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const category = String(formData.get('type') ?? 'Logs') as JournalCategory;
  const rawTag = formData.get('tag');
  const tag = rawTag && String(rawTag).trim() ? String(rawTag).trim() : null;

  // Validate form inputs using ArkType CreateJournalSchema
  const validation = CreateJournalSchema({
    title,
    content,
    type: category,
    tag,
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<JournalFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'content'
        | 'type'
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
        content,
        type: category,
        tag,
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
        content,
        type: category,
        tag,
      },
      success: false,
    };
  }

  const created = await withRequestContext(async ({ journal }) => {
    return await journal.createJournal(
      {
        title,
        content,
        type: category,
        tag,
      },
      userId,
    );
  });

  return {
    success: true,
    journalId: created.id,
    inputs: {
      title,
      content,
      type: category,
      tag,
    },
  };
}
