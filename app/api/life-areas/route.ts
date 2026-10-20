import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeLifeArea } from '@/features/life-areas/repositories';
import { CreateLifeAreaSchema } from '@/features/life-areas/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/life-areas
 * Returns list of life areas for authenticated user.
 */
export async function GET() {
  try {
    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const lifeAreas = await withRequestContext(async ({ lifeArea }) => {
      const entities = await lifeArea.findAllLifeAreas(userId);
      return entities.map(serializeLifeArea);
    });

    return NextResponse.json(
      { lifeAreas },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('Failed to get life areas in GET /api/life-areas:', error);
    return NextResponse.json(
      { lifeAreas: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/life-areas
 * Creates a new Life Area.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateLifeAreaSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const created = await withRequestContext(async ({ lifeArea }) => {
      return await lifeArea.createLifeArea({
        ...validation,
        userId,
      });
    });

    return NextResponse.json(
      { lifeArea: serializeLifeArea(created) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create life area in POST /api/life-areas:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
