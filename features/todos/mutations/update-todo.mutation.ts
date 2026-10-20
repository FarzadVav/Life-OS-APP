'use server';

import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { UpdateTodoSchema, type TodoFormState, type TodoType, type UpdateTodoData } from '../types';

/**
 * Server Action mutation for updating an existing Todo.
 * Connects directly to native client-side forms following Base UI and Next.js form guidelines.
 */
export async function updateTodoMutation(
  prevState: TodoFormState,
  formData: FormData,
): Promise<TodoFormState> {
  const idRaw = formData.get('id') || formData.get('editId');
  const id = Number(idRaw);

  if (!id || isNaN(id)) {
    return {
      errors: {
        general: ['Invalid or missing todo ID.'],
      },
      success: false,
    };
  }

  const title = formData.has('title') ? String(formData.get('title') ?? '').trim() : undefined;
  const typeValue = formData.has('type') ? (String(formData.get('type')) as TodoType) : undefined;
  const deadline = formData.has('deadline') ? String(formData.get('deadline') ?? '').trim() : undefined;
  const difficultyRaw = formData.get('difficulty');
  const difficulty = difficultyRaw !== null && difficultyRaw !== undefined && difficultyRaw !== ''
    ? Number(difficultyRaw)
    : undefined;
  const isDone = formData.has('isDone') ? formData.get('isDone') === 'true' : undefined;

  let lifeAreaId: number | null | undefined = undefined;
  if (formData.has('lifeAreaId')) {
    const rawVal = formData.get('lifeAreaId');
    if (rawVal === '' || rawVal === '0' || rawVal === 'none' || rawVal === null) {
      lifeAreaId = null;
    } else {
      lifeAreaId = Number(rawVal);
    }
  }

  let actions: UpdateTodoData['actions'] = undefined;
  const actionsRaw = formData.get('actions');
  if (actionsRaw) {
    try {
      actions = JSON.parse(String(actionsRaw)) as UpdateTodoData['actions'];
    } catch {
      actions = undefined;
    }
  }

  let disciplines: UpdateTodoData['disciplines'] = undefined;
  const disciplinesRaw = formData.get('disciplines');
  if (disciplinesRaw) {
    try {
      disciplines = JSON.parse(String(disciplinesRaw)) as UpdateTodoData['disciplines'];
    } catch {
      disciplines = undefined;
    }
  }

  // Validate form inputs using ArkType UpdateTodoSchema
  const updatePayload = {
    id,
    ...(title !== undefined ? { title } : {}),
    ...(typeValue !== undefined ? { type: typeValue } : {}),
    ...(deadline !== undefined ? { deadline } : {}),
    ...(difficulty !== undefined ? { difficulty } : {}),
    ...(isDone !== undefined ? { isDone } : {}),
    ...(lifeAreaId !== undefined ? { lifeAreaId } : {}),
    ...(actions !== undefined ? { actions } : {}),
    ...(disciplines !== undefined ? { disciplines } : {}),
  };

  const validation = UpdateTodoSchema(updatePayload);
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
        id,
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

  const updated = await withRequestContext(async ({ todo }) => {
    return await todo.updateTodo(id, {
      title,
      type: typeValue,
      deadline,
      difficulty,
      isDone,
      lifeAreaId,
      actions,
      disciplines,
    }, userId);
  });

  if (!updated) {
    return {
      errors: {
        general: ['Todo not found or not authorized to edit.'],
      },
      success: false,
    };
  }

  return {
    success: true,
    todoId: updated.id,
    inputs: {
      id: updated.id,
      title: updated.title,
      type: updated.type,
      deadline: updated.deadline,
      difficulty: updated.difficulty,
      lifeAreaId: updated.lifeArea?.id ?? null,
    },
  };
}
