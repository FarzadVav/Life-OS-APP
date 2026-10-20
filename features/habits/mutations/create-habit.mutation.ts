'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { CreateHabitSchema, type HabitFormState } from '../types';

export async function createHabitMutation(
  prevState: HabitFormState,
  formData: FormData,
): Promise<HabitFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const repeatInterval = String(formData.get('repeatInterval') ?? '').trim();
  const lifeAreaIdRaw = formData.get('lifeAreaId');
  const lifeAreaId =
    lifeAreaIdRaw && lifeAreaIdRaw !== '' && lifeAreaIdRaw !== '0' && lifeAreaIdRaw !== 'none'
      ? Number(lifeAreaIdRaw)
      : null;

  const validation = CreateHabitSchema({
    title,
    ...(description ? { description } : {}),
    ...(repeatInterval ? { repeatInterval } : {}),
    ...(lifeAreaId !== undefined ? { lifeAreaId } : {}),
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<HabitFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'description'
        | 'repeatInterval'
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
        description,
        repeatInterval,
        lifeAreaId,
      },
      success: false,
    };
  }

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  const created = await withRequestContext(async ({ habit }) => {
    return await habit.createHabit({
      title,
      description,
      repeatInterval,
      lifeAreaId,
      userId,
    });
  });

  return {
    success: true,
    habitId: created.id,
    inputs: {
      title,
      description,
      repeatInterval,
      lifeAreaId,
    },
  };
}
