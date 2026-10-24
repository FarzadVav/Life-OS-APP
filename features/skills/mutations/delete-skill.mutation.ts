'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for deleting a skill.
 * Reads the target id from the submitted form (hidden input).
 */
export async function deleteSkillMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid skill id' };
  }

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  try {
    await withRequestContext(async ({ skill }) => {
      await skill.deleteSkill(id, userId);
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete skill:', error);
    return { success: false, error: 'Failed to delete skill' };
  }
}
