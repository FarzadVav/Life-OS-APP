import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { getTodoByIdQuery } from '@/features/todos/queries';
import { serializeTodo } from '@/features/todos/repositories';
import { UpdateTodoSchema } from '@/features/todos/types';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/todos/[id]
 */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const todoId = Number(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const todo = await getTodoByIdQuery(todoId);
    if (!todo) {
      return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(
      { todo },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      },
    );
  } catch (error) {
    console.error('Failed to get todo by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PATCH /api/todos/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const todoId = Number(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const validation = UpdateTodoSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const updated = await withRequestContext(async ({ todo }) => {
      return await todo.updateTodo(todoId, validation, userId);
    });

    if (!updated) {
      return NextResponse.json({ message: 'Todo not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ todo: serializeTodo(updated) }, { status: 200 });
  } catch (error) {
    console.error('Failed to update todo:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/todos/[id]
 */
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const todoId = Number(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const success = await withRequestContext(async ({ todo }) => {
      return await todo.deleteTodo(todoId, userId);
    });

    if (!success) {
      return NextResponse.json({ message: 'Todo not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
