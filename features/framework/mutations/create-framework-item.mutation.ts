'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import {
  CreateFrameworkItemSchema,
  type FrameworkItemFormState,
  type FrameworkCategory,
  type FrameworkSection,
} from '../types';

/**
 * Server Action mutation for creating a new Framework item (Vision, Rule, or Concept).
 * Connects directly to client-side forms following Base UI and Next.js form guidelines.
 */
export async function createFrameworkItemMutation(
  prevState: FrameworkItemFormState,
  formData: FormData,
): Promise<FrameworkItemFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const category = String(formData.get('category') ?? 'Career') as FrameworkCategory;
  const section = String(formData.get('section') ?? 'Visions') as FrameworkSection;

  // Validate form inputs using ArkType CreateFrameworkItemSchema
  const validation = CreateFrameworkItemSchema({
    title,
    content,
    category,
    section,
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<FrameworkItemFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'content'
        | 'category'
        | 'section'
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
        category,
        section,
      },
      success: false,
    };
  }

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  const created = await withRequestContext(async ({ framework }) => {
    return await framework.createItem({
      title,
      content,
      category,
      section,
      userId,
    });
  });

  return {
    success: true,
    itemId: created.id,
    inputs: {
      title,
      content,
      category,
      section,
    },
  };
}
