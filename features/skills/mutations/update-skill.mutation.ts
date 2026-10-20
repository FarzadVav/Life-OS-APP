'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { UpdateSkillSchema, type SkillFormState } from '../types';

export async function updateSkillMutation(
  prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const idRaw = formData.get('id');
  const id = idRaw ? Number(idRaw) : NaN;
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '');
  const lifeAreaIdRaw = formData.get('lifeAreaId');
  const lifeAreaId =
    lifeAreaIdRaw && lifeAreaIdRaw !== '' && lifeAreaIdRaw !== '0' && lifeAreaIdRaw !== 'none'
      ? Number(lifeAreaIdRaw)
      : null;

  if (!id || Number.isNaN(id)) {
    return {
      errors: { general: ['Invalid skill id'] },
      success: false,
    };
  }

  const validation = UpdateSkillSchema({
    id,
    title: title || undefined,
    content,
    lifeAreaId,
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

  const updated = await withRequestContext(async ({ skill }) => {
    return await skill.updateSkill(
      id,
      {
        title: title || undefined,
        content,
        lifeAreaId,
      },
      userId,
    );
  });

  if (!updated) {
    return {
      errors: { general: ['Skill not found'] },
      success: false,
    };
  }

  return {
    success: true,
    skillId: updated.id,
    inputs: {
      title: updated.title,
      content: updated.content,
      lifeAreaId: updated.lifeArea?.id ?? null,
    },
  };
}
