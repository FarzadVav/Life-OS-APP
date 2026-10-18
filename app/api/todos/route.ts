import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { getTodosQuery } from '@/features/todos/queries';
import { serializeTodo } from '@/features/todos/repositories';
import { CreateTodoSchema, TodoType } from '@/features/todos/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/todos?type=Daily|Upcoming|Mission|all
 * Calls getTodosQuery and returns JSON payload for client SWR consumption.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get('type') || undefined;

    const todos = await getTodosQuery(typeParam as TodoType);

    return NextResponse.json(
      { todos },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('Failed to get todos in GET /api/todos:', error);
    return NextResponse.json(
      { todos: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/todos
 * Validates with ArkType CreateTodoSchema and persists via TodoRepository.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateTodoSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const created = await withRequestContext(async ({ todo }) => {
      return await todo.createTodo({
        ...validation,
        userId,
      });
    });

    return NextResponse.json(
      { todo: serializeTodo(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create todo in POST /api/todos:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
