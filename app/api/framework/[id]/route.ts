import { NextRequest, NextResponse } from 'next/server';
import { type } from 'arktype';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { getFrameworkItemByIdQuery } from '@/features/framework/queries';
import { serializeFrameworkItem } from '@/features/framework/repositories';
import { UpdateFrameworkItemSchema } from '@/features/framework/types';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/framework/[id]
 */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const item = await getFrameworkItemByIdQuery(itemId);
    if (!item) {
      return NextResponse.json({ message: 'Framework item not found' }, { status: 404 });
    }

    return NextResponse.json(
      { item },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      },
    );
  } catch (error) {
    console.error('Failed to get framework item by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PATCH /api/framework/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const validation = UpdateFrameworkItemSchema(body);

    if (validation instanceof type.errors) {
      return NextResponse.json(
        { errors: validation.summary, message: 'Validation failed' },
        { status: 400 },
      );
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const updated = await withRequestContext(async ({ framework }) => {
      return await framework.updateItem(itemId, validation, userId);
    });

    if (!updated) {
      return NextResponse.json({ message: 'Framework item not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ item: serializeFrameworkItem(updated) }, { status: 200 });
  } catch (error) {
    console.error('Failed to update framework item:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/framework/[id]
 */
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const session = await getSessionQuery();
    const userId = session?.userId ? Number(session.userId) : undefined;

    const success = await withRequestContext(async ({ framework }) => {
      return await framework.deleteItem(itemId, userId);
    });

    if (!success) {
      return NextResponse.json({ message: 'Framework item not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete framework item:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
