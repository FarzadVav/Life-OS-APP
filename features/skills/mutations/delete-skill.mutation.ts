'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';

export async function deleteSkillMutation(id: number) {
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
