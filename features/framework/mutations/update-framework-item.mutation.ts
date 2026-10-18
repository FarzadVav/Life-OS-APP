'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import {
  UpdateFrameworkItemSchema,
  type FrameworkItemFormState,
  type FrameworkCategory,
  type FrameworkSection,
} from '../types';

/**
 * Server Action mutation for updating an existing Framework item.
 * Connects directly to client-side forms following Base UI and Next.js form guidelines.
 */
export async function updateFrameworkItemMutation(
  prevState: FrameworkItemFormState,
  formData: FormData,
): Promise<FrameworkItemFormState> {
  const idRaw = formData.get('id') || formData.get('editId');
  const id = Number(idRaw);

  if (!id || isNaN(id)) {
    return {
      errors: {
        general: ['Invalid or missing framework item ID.'],
      },
      success: false,
    };
  }

  const title = formData.has('title') ? String(formData.get('title') ?? '').trim() : undefined;
  const content = formData.has('content') ? String(formData.get('content') ?? '').trim() : undefined;
  const category = formData.has('category')
    ? (String(formData.get('category')) as FrameworkCategory)
    : undefined;
  const section = formData.has('section')
    ? (String(formData.get('section')) as FrameworkSection)
    : undefined;

  const updatePayload = {
    id,
    ...(title !== undefined ? { title } : {}),
    ...(content !== undefined ? { content } : {}),
    ...(category !== undefined ? { category } : {}),
    ...(section !== undefined ? { section } : {}),
  };

  const validation = UpdateFrameworkItemSchema(updatePayload);
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
        id,
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

  const updated = await withRequestContext(async ({ framework }) => {
    return await framework.updateItem(
      id,
      {
        title,
        content,
        category,
        section,
      },
      userId,
    );
  });

  if (!updated) {
    return {
      errors: {
        general: ['Framework item not found or unauthorized.'],
      },
      success: false,
    };
  }

  return {
    success: true,
    itemId: id,
    inputs: {
      id,
      title,
      content,
      category,
      section,
    },
  };
}
