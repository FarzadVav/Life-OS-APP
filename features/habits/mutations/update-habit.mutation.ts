'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { UpdateHabitSchema, type HabitFormState } from '../types';

export async function updateHabitMutation(
  prevState: HabitFormState,
  formData: FormData,
): Promise<HabitFormState> {
  const idRaw = formData.get('id');
  const id = idRaw ? Number(idRaw) : NaN;
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const repeatInterval = String(formData.get('repeatInterval') ?? '').trim();
  const lifeAreaIdRaw = formData.get('lifeAreaId');
  const lifeAreaId =
    lifeAreaIdRaw && lifeAreaIdRaw !== '' && lifeAreaIdRaw !== '0' && lifeAreaIdRaw !== 'none'
      ? Number(lifeAreaIdRaw)
      : null;

  if (!id || Number.isNaN(id)) {
    return {
      errors: { general: ['Invalid habit id'] },
      success: false,
    };
  }

  const validation = UpdateHabitSchema({
    id,
    title: title || undefined,
    ...(description ? { description } : {}),
    ...(repeatInterval ? { repeatInterval } : {}),
    lifeAreaId,
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

  const updated = await withRequestContext(async ({ habit }) => {
    return await habit.updateHabit(
      id,
      {
        title: title || undefined,
        description,
        repeatInterval,
        lifeAreaId,
      },
      userId,
    );
  });

  if (!updated) {
    return {
      errors: { general: ['Habit not found'] },
      success: false,
    };
  }

  return {
    success: true,
    habitId: updated.id,
    inputs: {
      title: updated.title,
      description: updated.description,
      repeatInterval: updated.repeatInterval,
      lifeAreaId: updated.lifeArea?.id ?? null,
    },
  };
}
