'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { CreateTodoSchema, type TodoFormState, type TodoType, type CreateTodoData } from '../types';

/**
 * Server Action mutation for creating a new Todo (Daily, Upcoming, or Mission with actions/disciplines).
 * Connects directly to native client-side forms following Base UI and Next.js form guidelines.
 */
export async function createTodoMutation(
  prevState: TodoFormState,
  formData: FormData,
): Promise<TodoFormState> {
  const title = String(formData.get('title') ?? '').trim();
  const typeValue = String(formData.get('type') ?? 'Daily') as TodoType;
  const deadline = String(formData.get('deadline') ?? '').trim();
  const difficultyRaw = formData.get('difficulty');
  const difficulty = difficultyRaw ? Number(difficultyRaw) : undefined;

  const lifeAreaIdRaw = formData.get('lifeAreaId');
  const lifeAreaId =
    lifeAreaIdRaw && lifeAreaIdRaw !== '' && lifeAreaIdRaw !== '0' && lifeAreaIdRaw !== 'none'
      ? Number(lifeAreaIdRaw)
      : null;

  let actions: CreateTodoData['actions'] = undefined;
  const actionsRaw = formData.get('actions');
  if (actionsRaw) {
    try {
      actions = JSON.parse(String(actionsRaw)) as CreateTodoData['actions'];
    } catch {
      actions = undefined;
    }
  }

  let disciplines: CreateTodoData['disciplines'] = undefined;
  const disciplinesRaw = formData.get('disciplines');
  if (disciplinesRaw) {
    try {
      disciplines = JSON.parse(String(disciplinesRaw)) as CreateTodoData['disciplines'];
    } catch {
      disciplines = undefined;
    }
  }

  // Validate form inputs using ArkType CreateTodoSchema
  const validation = CreateTodoSchema({
    title,
    type: typeValue,
    deadline,
    ...(difficulty !== undefined ? { difficulty } : {}),
    ...(lifeAreaId !== undefined ? { lifeAreaId } : {}),
    ...(actions && actions.length > 0 ? { actions } : {}),
    ...(disciplines && disciplines.length > 0 ? { disciplines } : {}),
  });

  if (validation instanceof type.errors) {
    const errors: NonNullable<TodoFormState>['errors'] = {};

    for (const problem of validation) {
      const field = String(problem.path[0] ?? 'general') as
        | 'title'
        | 'type'
        | 'deadline'
        | 'difficulty'
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
        type: typeValue,
        deadline,
        difficulty,
        lifeAreaId,
      },
      success: false,
    };
  }

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  const created = await withRequestContext(async ({ todo }) => {
    return await todo.createTodo({
      title,
      type: typeValue,
      deadline,
      difficulty,
      lifeAreaId,
      userId,
      actions,
      disciplines,
    });
  });

  return {
    success: true,
    todoId: created.id,
    inputs: {
      title,
      type: typeValue,
      deadline,
      difficulty,
      lifeAreaId,
    },
  };
}
