'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import { lifeAreaFieldError } from '@/features/life-areas/lib/lifeAreaFieldError';
import { parseLifeAreaSlug } from '@/features/general/lib/lifeAreaSlug';
import { CreateSkillSchema, type SkillFormState } from '../types';

export async function createSkillMutation(
  prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '');
  const lifeAreaId = parseLifeAreaSlug(String(formData.get('lifeAreaId') ?? '')) ?? null;
  const rawTag = formData.get('tag');
  const tag = rawTag && String(rawTag).trim() ? String(rawTag).trim() : null;

  const validation = CreateSkillSchema({
    title,
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

  const inputs = { title, content, lifeAreaId, tag };

  let created;
  try {
    created = await withRequestContext(async ({ skill }) => {
      return await skill.createSkill(
        {
          title,
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
      return { errors: { lifeAreaId: [fieldError] }, inputs, success: false };
    }
    throw error;
  }

  return {
    success: true,
    skillId: created.id,
    inputs,
  };
}
