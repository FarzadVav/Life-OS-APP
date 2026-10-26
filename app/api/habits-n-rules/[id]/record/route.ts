import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
import { authzResponse } from '@/features/general/lib/api/respond';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/habits/[id]/record
 * Records habit check-in status (I Do / I Don't Do) consistently with mission discipline.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const habitId = Number(id);

    if (isNaN(habitId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const isDone = body.isDone !== undefined ? Boolean(body.isDone) : true;
    const date = body.date || new Date().toISOString().slice(0, 10);

    const history = await withRequestContext(async ({ habit }) => {
      return await habit.recordHistory(habitId, date, isDone, userId);
    });

    if (!history) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        history: {
          id: history.id,
          date: history.date,
          isDone: history.isDone,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const authz = authzResponse(error);
    if (authz) return authz;
    console.error('Failed to record habit history in POST /api/habits/[id]/record:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
