import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeTodo } from '@/features/todos/repositories';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/todos/[id]/toggle
 * Toggles isDone status of a todo.
 */
export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const todoId = Number(id);

    if (isNaN(todoId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const updated = await withRequestContext(async ({ todo }) => {
      let result = await todo.toggleDone(todoId, userId);
      if (!result && !userId) {
        result = await todo.toggleDone(todoId);
      }
      return result;
    });

    if (!updated) {
      return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, todo: serializeTodo(updated) }, { status: 200 });
  } catch (error) {
    console.error('Failed to toggle todo in /api/todos/[id]/toggle:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
