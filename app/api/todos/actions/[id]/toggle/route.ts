import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/todos/actions/[id]/toggle
 * Toggles isDone status of a mission action item.
 */
export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const actionId = Number(id);

    if (isNaN(actionId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const updated = await withRequestContext(async ({ todoAction }) => {
      return await todoAction.toggleAction(actionId);
    });

    if (!updated) {
      return NextResponse.json({ message: 'Action not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        action: {
          id: updated.id,
          title: updated.title,
          deadline: updated.deadline,
          isDone: updated.isDone,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to toggle action:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
