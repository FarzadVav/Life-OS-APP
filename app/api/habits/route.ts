import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeHabit } from '@/features/habits/repositories';
import { CreateHabitSchema } from '@/features/habits/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/habits?lifeAreaId=...
 * Returns list of habits for authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const searchParams = request.nextUrl.searchParams;
    const lifeAreaIdParam = searchParams.get('lifeAreaId');
    const lifeAreaId =
      lifeAreaIdParam !== null && lifeAreaIdParam !== undefined
        ? Number(lifeAreaIdParam)
        : undefined;

    const habits = await withRequestContext(async ({ habit }) => {
      const entities = await habit.findAllHabits(userId, { lifeAreaId });
      return entities.map(serializeHabit);
    });

    return NextResponse.json(
      { habits },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('Failed to get habits in GET /api/habits:', error);
    return NextResponse.json(
      { habits: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/habits
 * Creates a new Habit.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateHabitSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const created = await withRequestContext(async ({ habit }) => {
      return await habit.createHabit({
        ...validation,
        userId,
      });
    });

    return NextResponse.json(
      { habit: serializeHabit(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create habit in POST /api/habits:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
