'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { lifeAreaFieldError } from '@/features/life-areas/lib/lifeAreaFieldError';
import { parseLifeAreaSlug } from '@/features/general/lib/lifeAreaSlug';
import { UpdateSkillSchema, type SkillFormState } from '../types';

export async function updateSkillMutation(
  prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const idRaw = formData.get('id');
  const id = idRaw ? Number(idRaw) : NaN;
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '');
  const lifeAreaId = parseLifeAreaSlug(String(formData.get('lifeAreaId') ?? '')) ?? null;
  const rawTag = formData.get('tag');
  const tag = rawTag && String(rawTag).trim() ? String(rawTag).trim() : null;

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
    tag,
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<SkillFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'content'
        | 'lifeAreaId'
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
        lifeAreaId,
        tag,
      },
      success: false,
    };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return {
      errors: { general: ['Your session has expired. Please sign in again.'] },
      inputs: { title, content, lifeAreaId, tag },
      success: false,
    };
  }

  let updated;
  try {
    updated = await withRequestContext(async ({ skill }) => {
      return await skill.updateSkill(
        id,
        {
          title: title || undefined,
          content,
          lifeAreaId,
          tag,
        },
        userId,
      );
    });
  } catch (error) {
    const fieldError = lifeAreaFieldError(error);
    if (fieldError) {
      return {
        errors: { lifeAreaId: [fieldError] },
        inputs: { title, content, lifeAreaId, tag },
        success: false,
      };
    }
    throw error;
  }

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
      tag: updated.tag ?? null,
    },
  };
}
