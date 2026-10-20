import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeLifeArea } from '@/features/life-areas/repositories';
import { UpdateLifeAreaSchema } from '@/features/life-areas/types';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/life-areas/[id]
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const item = await withRequestContext(async ({ lifeArea }) => {
      return await lifeArea.findById(id, userId);
    });

    if (!item) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ lifeArea: serializeLifeArea(item) }, { status: 200 });
  } catch (error) {
    console.error('Failed to get life area by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PUT/PATCH /api/life-areas/[id]
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const validation = UpdateLifeAreaSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const updated = await withRequestContext(async ({ lifeArea }) => {
      return await lifeArea.updateLifeArea(id, validation, userId);
    });

    if (!updated) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ lifeArea: serializeLifeArea(updated) }, { status: 200 });
  } catch (error) {
    console.error('Failed to update life area:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/life-areas/[id]
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const deleted = await withRequestContext(async ({ lifeArea }) => {
      return await lifeArea.deleteLifeArea(id, userId);
    });

    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete life area:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
