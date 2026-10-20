'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { CreateSkillSchema, type SkillFormState } from '../types';

export async function createSkillMutation(
  prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '');
  const lifeAreaIdRaw = formData.get('lifeAreaId');
  const lifeAreaId =
    lifeAreaIdRaw && lifeAreaIdRaw !== '' && lifeAreaIdRaw !== '0' && lifeAreaIdRaw !== 'none'
      ? Number(lifeAreaIdRaw)
      : null;

  const validation = CreateSkillSchema({
    title,
    content,
    ...(lifeAreaId !== undefined ? { lifeAreaId } : {}),
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<SkillFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'content'
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
        content,
        lifeAreaId,
      },
      success: false,
    };
  }

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  const created = await withRequestContext(async ({ skill }) => {
    return await skill.createSkill({
      title,
      content,
      lifeAreaId,
      userId,
    });
  });

  return {
    success: true,
    skillId: created.id,
    inputs: {
      title,
      content,
      lifeAreaId,
    },
  };
}
